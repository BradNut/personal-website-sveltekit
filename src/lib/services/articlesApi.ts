import intersect from 'just-intersect';
import { ENV } from 'varlock/env';
import { ARTICLES_CACHE_TTL_SECONDS, NO_CACHE } from '$lib/constants/cache-control';
import { REDIS_PREFIXES, redisService } from '$lib/server/redis';
import type { Article, ArticlePageLoad, WallabagArticle } from '$lib/types/article';
import { ArticleTag } from '$lib/types/articleTag';
import { retryWithBackoff } from '$lib/util/retry';
import type { PageQuery } from '../types/pageQuery';

// Lazy URL construction — WALLABAG_URL may be empty locally; only evaluated at request time
const getTokenUrl = () => new URL('/oauth/v2/token', ENV.WALLABAG_URL).toString();
const getEntriesUrl = () => new URL('/api/entries.json', ENV.WALLABAG_URL).toString();

function resolvePerPage(limit: string | undefined): number {
  const parsed = Number(limit);
  if (Number.isNaN(parsed) || parsed > 30 || parsed < 1) {
    return Number(ENV.PAGE_SIZE);
  }
  return parsed;
}

function buildEntriesParams(queryParams: Record<string, string>): URLSearchParams {
  const pageQuery: PageQuery = {
    sort: 'updated',
    perPage: resolvePerPage(queryParams?.limit),
    since: 0,
    page: Number(queryParams?.page) || 1,
    tags: 'programming',
    content: 'metadata',
  };
  return new URLSearchParams({
    sort: pageQuery.sort,
    perPage: `${pageQuery.perPage}`,
    since: `${pageQuery.since}`,
    page: `${pageQuery.page}`,
    tags: pageQuery.tags,
    content: pageQuery.content,
  });
}

async function getCachedResponse(cacheKey: string): Promise<ArticlePageLoad | null> {
  if (!ENV.USE_REDIS_CACHE) return null;
  const cached = await redisService.get({ prefix: REDIS_PREFIXES.ARTICLES, key: cacheKey });
  if (!cached) return null;
  // Cache hit, return cached payload with TTL-derived cache-control
  const response = JSON.parse(cached);
  const ttl = await redisService.ttl({ prefix: REDIS_PREFIXES.ARTICLES, key: cacheKey });
  // ttl <= 0: expired, no expiry set, or the TTL lookup failed open; don't send max-age=0 or negative
  return { ...response, cacheControl: ttl > 0 ? `max-age=${ttl}` : 'no-cache' };
}

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

function buildFallbackResponse(queryParams: Record<string, string>): ArticlePageLoad {
  return {
    articles: [],
    currentPage: Number(queryParams?.page) || 1,
    totalPages: 0,
    limit: Number(queryParams?.limit) || Number(ENV.PAGE_SIZE),
    totalArticles: 0,
    cacheControl: 'no-cache',
  };
}

export async function fetchArticles(queryParams: Record<string, string>): Promise<ArticlePageLoad> {
  try {
    const entriesQueryParams = buildEntriesParams(queryParams);
    const cacheKey = entriesQueryParams.toString();

    const cachedResponse = await getCachedResponse(cacheKey);
    if (cachedResponse) return cachedResponse;

    if (Date.now() < unavailableUntil) {
      return buildFallbackResponse(queryParams);
    }

    const { wallabagResponse, cacheControl } = await fetchEntriesOrCoolDown(entriesQueryParams);
    const { _embedded: favoriteArticles, page, pages, total, limit } = wallabagResponse;

    // Minimal, non-sensitive diagnostics
    console.info(`Wallabag entries: page=${page} pages=${pages} total=${total} limit=${limit}`);

    const articles = mapWallabagArticles(favoriteArticles.items as WallabagArticle[]);
    // An empty list is never cacheable: if every entry was filtered out, a 12-hour header would keep it around after a fix
    const cacheable = articles.length > 0;
    const responseData: ArticlePageLoad = {
      articles,
      currentPage: page,
      totalPages: pages,
      limit,
      totalArticles: total,
      cacheControl: cacheable ? cacheControl : NO_CACHE,
    };

    if (ENV.USE_REDIS_CACHE && cacheable) {
      console.log(`Storing in cache with key: ${cacheKey} for page ${page}`);
      await redisService.setWithExpiry({
        prefix: REDIS_PREFIXES.ARTICLES,
        key: cacheKey,
        value: JSON.stringify(responseData),
        expiry: ARTICLES_CACHE_TTL_SECONDS,
      });
    }

    return responseData;
  } catch (error) {
    console.error(`Error fetching articles for page ${queryParams?.page}:`, error);
    return buildFallbackResponse(queryParams);
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
