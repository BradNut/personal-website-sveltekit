import intersect from 'just-intersect';
import { ENV } from 'varlock/env';
import { REDIS_PREFIXES, redisService } from '$lib/server/redis';
import type { Article, ArticlePageLoad, WallabagArticle } from '$lib/types/article';
import { ArticleTag } from '$lib/types/articleTag';
import type { PageQuery } from '$lib/types/pageQuery';
import { retryWithBackoff } from '$lib/util/retry';

type FavoriteArticlesQuery = {
  page?: string;
  limit?: string;
};

const wallabagBase = new URL(ENV.WALLABAG_URL ?? '');
const tokenUrl = new URL('/oauth/v2/token', wallabagBase).toString();
const entriesUrl = new URL('/api/entries.json', wallabagBase).toString();

function resolvePerPage(limit: string | undefined): number {
  const parsed = Number(limit);
  if (Number.isNaN(parsed) || parsed > 30 || parsed < 1) {
    return Number(ENV.PAGE_SIZE);
  }
  return parsed;
}

function buildEntriesParams(queryParams: FavoriteArticlesQuery): URLSearchParams {
  const pageQuery: PageQuery = {
    sort: 'updated',
    perPage: resolvePerPage(queryParams.limit),
    since: 0,
    page: Number(queryParams.page) || 1,
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
  const response = JSON.parse(cached);
  const ttl = await redisService.ttl({ prefix: REDIS_PREFIXES.ARTICLES, key: cacheKey });
  return { ...response, cacheControl: `max-age=${ttl}` };
}

async function authenticateWallabag(): Promise<{ access_token: string }> {
  return retryWithBackoff(async () => {
    const authResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: ENV.WALLABAG_CLIENT_ID ?? '',
        client_secret: ENV.WALLABAG_CLIENT_SECRET,
        username: ENV.WALLABAG_USERNAME,
        password: ENV.WALLABAG_PASSWORD,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!authResponse.ok) {
      throw new Error(`Auth failed: ${authResponse.status} ${authResponse.statusText}`);
    }

    return await authResponse.json();
  });
}

async function fetchWallabagEntries(accessToken: string, params: URLSearchParams) {
  return retryWithBackoff(async () => {
    const requestUrl = `${entriesUrl}?${params}`;
    const pageResponse = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!pageResponse.ok) {
      console.warn(`Wallabag entries request failed: ${pageResponse.status} ${pageResponse.statusText}`);
      throw new Error(`API request failed: ${pageResponse.status} ${pageResponse.statusText}`);
    }

    const cacheControl = pageResponse.headers.get('cache-control') || 'no-cache';
    const wallabagResponse = await pageResponse.json();
    return { wallabagResponse, cacheControl };
  });
}

function mapWallabagArticles(items: WallabagArticle[]): Article[] {
  const validTags = Object.values(ArticleTag);
  return items.reduce<Article[]>((acc, article) => {
    const rawTags = article.tags.map((tag) => tag.slug);
    if (intersect(rawTags, validTags).length > 0) {
      acc.push({
        tags: rawTags.map((rawTag) => rawTag as ArticleTag),
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

function buildFallbackResponse(queryParams: FavoriteArticlesQuery): ArticlePageLoad {
  return {
    articles: [],
    currentPage: Number(queryParams.page) || 1,
    totalPages: 0,
    limit: Number(queryParams.limit) || Number(ENV.PAGE_SIZE),
    totalArticles: 0,
    cacheControl: 'no-cache',
  };
}

async function fetchWallabagArticlePage(entriesQueryParams: URLSearchParams): Promise<ArticlePageLoad> {
  const auth = await authenticateWallabag();
  const { wallabagResponse, cacheControl } = await fetchWallabagEntries(auth.access_token, entriesQueryParams);
  const { _embedded: favoriteArticles, page, pages, total, limit } = wallabagResponse;

  console.info(`Wallabag entries: page=${page} pages=${pages} total=${total} limit=${limit}`);

  const articles = mapWallabagArticles(favoriteArticles.items as WallabagArticle[]);
  return { articles, currentPage: page, totalPages: pages, limit, totalArticles: total, cacheControl };
}

async function cacheArticlePage(cacheKey: string, responseData: ArticlePageLoad): Promise<void> {
  if (ENV.USE_REDIS_CACHE && responseData.articles.length > 0) {
    console.log(`Storing in cache with key: ${cacheKey} for page ${responseData.currentPage}`);
    await redisService.setWithExpiry({ prefix: REDIS_PREFIXES.ARTICLES, key: cacheKey, value: JSON.stringify(responseData), expiry: 43200 });
  }
}

export async function fetchFavoriteArticles(queryParams: FavoriteArticlesQuery): Promise<ArticlePageLoad> {
  try {
    const entriesQueryParams = buildEntriesParams(queryParams);
    const cacheKey = entriesQueryParams.toString();

    const cachedResponse = await getCachedResponse(cacheKey);
    if (cachedResponse) return cachedResponse;

    const responseData = await fetchWallabagArticlePage(entriesQueryParams);
    await cacheArticlePage(cacheKey, responseData);
    return responseData;
  } catch (error) {
    console.error(`Error fetching articles for page ${queryParams.page}:`, error);
    return buildFallbackResponse(queryParams);
  }
}
