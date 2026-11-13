import intersect from 'just-intersect';
import { ENV } from 'varlock/env';
import { ARTICLES_CACHE_TTL_SECONDS, NO_CACHE } from '#lib/constants/cache-control.ts';
import { REDIS_PREFIXES } from '#lib/server/redis.ts';
import { type CachedResponse, createResponseCache } from '#lib/server/responseCache.ts';
import type { Article, ArticlePageLoad, WallabagArticle } from '#lib/types/article.ts';
import { ArticleTag } from '#lib/types/articleTag.ts';
import { retryWithBackoff } from '#lib/util/retry.ts';

// Lazy URL construction — WALLABAG_URL may be empty locally; only evaluated at request time
const getTokenUrl = () => new URL('/oauth/v2/token', ENV.WALLABAG_URL).toString();
const getEntriesUrl = () => new URL('/api/entries.json', ENV.WALLABAG_URL).toString();

/** Which page of Favorite Articles to fetch: raw route/query strings; invalid values fall back to defaults. */
type ArticlesQuery = { page?: string; limit?: string };

function resolvePerPage(limit: string | undefined): number {
  const parsed = Number(limit);
  if (Number.isNaN(parsed) || parsed > 30 || parsed < 1) {
    return Number(ENV.PAGE_SIZE);
  }
  return parsed;
}

/**
 * Wallabag can't page by date added: its `sort=created` orders by entry id, and the Wallabag migration
 * imported entries in an order that doesn't match `created_at` (`updated_at` was bulk-rewritten too).
 * So the full tagged list is fetched in batches, sorted by `created_at` here, cached once, and paged locally.
 */
const WALLABAG_BATCH_SIZE = 100;
/** Upper bound on batches per refresh, so a misreported page count can't loop indefinitely. */
const MAX_WALLABAG_BATCHES = 20;
const ARTICLE_LIST_CACHE_KEY = 'all-by-created-desc';

function buildEntriesParams(page: number): URLSearchParams {
  return new URLSearchParams({
    perPage: `${WALLABAG_BATCH_SIZE}`,
    since: '0',
    page: `${page}`,
    tags: 'programming',
    content: 'metadata',
  });
}

/** Every published article, newest added first. */
type ArticleList = { articles: Article[] };

const articlesCache = createResponseCache<ArticleList>({ prefix: REDIS_PREFIXES.ARTICLES, ttlSeconds: ARTICLES_CACHE_TTL_SECONDS });

/** How long to stop calling Wallabag after a failure, so a dead upstream can't stall every page. */
const WALLABAG_COOLDOWN_MS = 5 * 60 * 1000;
/** Refresh the access token this long before Wallabag says it expires. */
const TOKEN_EXPIRY_MARGIN_MS = 60 * 1000;

class WallabagHttpError extends Error {
  constructor(
    readonly step: 'auth' | 'entries',
    readonly status: number,
    statusText: string,
  ) {
    super(`Wallabag ${step} request failed: ${status} ${statusText}`);
    this.name = 'WallabagHttpError';
  }
}

/**
 * Retry only transient failures. A timeout already waited the full deadline, and a 4xx
 * (bad credentials, expired token) won't change on retry; repeated failed logins are
 * also what gets an IP rate-limited or banned.
 */
function isRetryable(error: unknown): boolean {
  if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) return false;
  if (error instanceof WallabagHttpError && error.status < 500) return false;
  return true;
}

type CachedToken = { accessToken: string; expiresAt: number };

let cachedToken: CachedToken | null = null;
let pendingAuth: Promise<CachedToken> | null = null;
let unavailableUntil = 0;
let pendingList: Promise<CachedResponse<ArticleList>> | null = null;

async function requestAccessToken(): Promise<CachedToken> {
  return retryWithBackoff(
    async () => {
      const authResponse = await fetch(getTokenUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: ENV.WALLABAG_CLIENT_ID ?? '',
          client_secret: ENV.WALLABAG_CLIENT_SECRET,
          username: ENV.WALLABAG_USERNAME,
          password: ENV.WALLABAG_PASSWORD,
        }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!authResponse.ok) {
        throw new WallabagHttpError('auth', authResponse.status, authResponse.statusText);
      }

      const { access_token, expires_in }: { access_token: string; expires_in?: number } = await authResponse.json();
      const lifetimeMs = (Number(expires_in) || 0) * 1000;
      return { accessToken: access_token, expiresAt: Date.now() + lifetimeMs - TOKEN_EXPIRY_MARGIN_MS };
    },
    3,
    500,
    { shouldRetry: isRetryable },
  );
}

/** Reuses the access token until shortly before expiry; concurrent callers share one login. */
async function getAccessToken(): Promise<{ accessToken: string; reused: boolean }> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return { accessToken: cachedToken.accessToken, reused: true };
  }

  pendingAuth ??= requestAccessToken().finally(() => {
    pendingAuth = null;
  });
  const token = await pendingAuth;
  cachedToken = token.expiresAt > Date.now() ? token : null;
  return { accessToken: token.accessToken, reused: false };
}

async function fetchWallabagEntries(accessToken: string, params: URLSearchParams) {
  return retryWithBackoff(
    async () => {
      const requestUrl = `${getEntriesUrl()}?${params}`;
      const pageResponse = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      if (!pageResponse.ok) {
        // Log status only to avoid leaking headers/body
        console.warn(`Wallabag entries request failed: ${pageResponse.status} ${pageResponse.statusText}`);
        throw new WallabagHttpError('entries', pageResponse.status, pageResponse.statusText);
      }

      const cacheControl = pageResponse.headers.get('cache-control') || 'no-cache';
      const wallabagResponse = await pageResponse.json();
      return { wallabagResponse, cacheControl };
    },
    3,
    500,
    { shouldRetry: isRetryable },
  );
}

/** Fetches entries, logging in again once if a reused token has been revoked or expired early. */
async function fetchEntriesWithAuth(params: URLSearchParams) {
  const { accessToken, reused } = await getAccessToken();
  try {
    return await fetchWallabagEntries(accessToken, params);
  } catch (error) {
    if (!(reused && error instanceof WallabagHttpError && error.status === 401)) throw error;
    cachedToken = null;
    const fresh = await getAccessToken();
    return fetchWallabagEntries(fresh.accessToken, params);
  }
}

/** Self-hosted Wallabag 2.6+ prefixes every tag slug with `t:`; wallabag.it does not. */
function normaliseTagSlug(slug: string): string {
  return slug.replace(/^t:/i, '').toLowerCase();
}

function mapWallabagArticles(items: WallabagArticle[]): Article[] {
  const validTags = Object.values(ArticleTag);
  return items.reduce<Article[]>((acc, article) => {
    const tagSlugs = (article?.tags ?? []).map((tag) => normaliseTagSlug(tag.slug));
    if (intersect(tagSlugs, validTags).length > 0) {
      acc.push({
        tags: tagSlugs.map((slug) => slug as unknown as ArticleTag),
        title: article.title,
        url: new URL(article.url),
        domain_name: article.domain_name?.replace('www.', '') ?? '',
        hashed_url: article.hashed_url,
        reading_time: article.reading_time,
        preview_picture: article.preview_picture,
        created_at: new Date(article.created_at),
        updated_at: new Date(article.updated_at),
        archived_at: article.archived_at ? new Date(article.archived_at) : null,
      });
    }
    return acc;
  }, []);
}

function byNewestAdded(a: Article, b: Article): number {
  return b.created_at.getTime() - a.created_at.getTime();
}

/** Fetches every tagged Wallabag entry and sorts the published ones newest added first. */
async function fetchArticleList(): Promise<CachedResponse<ArticleList>> {
  // The first batch reports how many batches there are; the rest are fetched in parallel (arrival order is irrelevant, the list is sorted below)
  const first = await fetchEntriesOrCoolDown(buildEntriesParams(1));
  const batches = Math.min(Number(first.wallabagResponse.pages) || 1, MAX_WALLABAG_BATCHES);
  const rest = await Promise.all(Array.from({ length: batches - 1 }, (_, i) => fetchEntriesOrCoolDown(buildEntriesParams(i + 2))));
  const items = [first, ...rest].flatMap(({ wallabagResponse }) => (wallabagResponse._embedded?.items ?? []) as WallabagArticle[]);
  const { cacheControl } = first;

  // Minimal, non-sensitive diagnostics
  console.info(`Wallabag entries: fetched=${items.length} batches=${batches}`);

  const articles = mapWallabagArticles(items).sort(byNewestAdded);
  // An empty list is never cacheable: if every entry was filtered out, a 12-hour header would keep it around after a fix
  if (articles.length === 0) return { value: { articles }, cacheControl: NO_CACHE };

  await articlesCache.write(ARTICLE_LIST_CACHE_KEY, { articles });
  return { value: { articles }, cacheControl };
}

/** The sorted article list from cache, or from Wallabag (one shared fetch for concurrent callers); `null` during a cool-down. */
async function loadArticleList(): Promise<CachedResponse<ArticleList> | null> {
  const cached = await articlesCache.read(ARTICLE_LIST_CACHE_KEY);
  if (cached) return cached;

  if (Date.now() < unavailableUntil) return null;

  pendingList ??= fetchArticleList().finally(() => {
    pendingList = null;
  });
  return pendingList;
}

function buildFallbackResponse(currentPage: number, limit: number): ArticlePageLoad {
  return {
    articles: [],
    currentPage,
    totalPages: 0,
    limit,
    totalArticles: 0,
    cacheControl: NO_CACHE,
  };
}

export async function fetchArticles(queryParams: ArticlesQuery): Promise<ArticlePageLoad> {
  const perPage = resolvePerPage(queryParams.limit);
  const currentPage = Number(queryParams.page) || 1;

  try {
    const list = await loadArticleList();
    if (!list) return buildFallbackResponse(currentPage, perPage);

    const { articles } = list.value;
    const start = (currentPage - 1) * perPage;
    return {
      articles: articles.slice(start, start + perPage),
      currentPage,
      totalPages: Math.ceil(articles.length / perPage),
      limit: perPage,
      totalArticles: articles.length,
      cacheControl: list.cacheControl,
    };
  } catch (error) {
    console.error(`Error fetching articles for page ${queryParams.page}:`, error);
    return buildFallbackResponse(currentPage, perPage);
  }
}

/** Calls Wallabag; on failure, skips it for WALLABAG_COOLDOWN_MS so every page doesn't wait on a dead upstream. */
async function fetchEntriesOrCoolDown(params: URLSearchParams) {
  try {
    return await fetchEntriesWithAuth(params);
  } catch (error) {
    unavailableUntil = Date.now() + WALLABAG_COOLDOWN_MS;
    console.warn(`Wallabag unavailable; skipping requests for ${WALLABAG_COOLDOWN_MS / 1000}s`);
    throw error;
  }
}
