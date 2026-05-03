import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock varlock/env used by the service
vi.mock('varlock/env', () => ({
  ENV: {
    PAGE_SIZE: 10,
    USE_REDIS_CACHE: true,
    WALLABAG_CLIENT_ID: 'cid',
    WALLABAG_CLIENT_SECRET: 'csecret',
    WALLABAG_PASSWORD: 'pw',
    WALLABAG_URL: 'https://example.com',
    WALLABAG_USERNAME: 'user',
    REDIS_URI: 'redis://test-host:6379',
  },
}));

// Mock redis service
const redisGet = vi.fn();
const redisSetWithExpiry = vi.fn();
const redisTtl = vi.fn();
vi.mock('$lib/server/redis', () => ({
  redisService: {
    get: (data: { prefix: string; key: string }) => redisGet(data),
    set: vi.fn(),
    setWithExpiry: (data: { prefix: string; key: string; value: string; expiry: number }) => redisSetWithExpiry(data),
    ttl: (data: { prefix: string; key: string }) => redisTtl(data),
    delete: vi.fn(),
    scan: vi.fn(),
    redis: null,
  },
  REDIS_PREFIXES: {
    ARTICLES: 'articles',
    BANDCAMP_ALBUMS: 'bandcampAlbums',
    PAGE_CACHE: 'pageCache',
  },
}));

import { fetchArticlesApi } from './articlesApi';

type MockResponse<T> = {
  ok: boolean;
  headers?: { get: (k: string) => string | null };
  json: () => Promise<T>;
};

const makeWallabagResponse = () => ({
  _embedded: {
    items: [
      {
        title: 'Article 1',
        url: 'https://example.com/a1',
        domain_name: 'www.example.com',
        hashed_url: 'hash1',
        reading_time: 5,
        preview_picture: 'https://example.com/img.jpg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        archived_at: null,
        tags: [{ id: 1, label: 'Programming', slug: 'programming' }],
      },
    ],
  },
  page: 1,
  pages: 1,
  total: 1,
  limit: 10,
});

const makeCachedResponse = () => ({
  articles: [],
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  totalArticles: 0,
  cacheControl: 'max-age=60',
});

const originalFetch: typeof globalThis.fetch = globalThis.fetch;

beforeEach(() => {
  vi.useFakeTimers();
  redisGet.mockReset();
  redisSetWithExpiry.mockReset();
  redisTtl.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
  globalThis.fetch = originalFetch;
});

describe('fetchArticlesApi', () => {
  it('returns cached response with cacheControl on cache hit', async () => {
    const cached = makeCachedResponse();
    redisGet.mockResolvedValueOnce(JSON.stringify(cached));
    redisTtl.mockResolvedValueOnce(60);

    // fetch should not be called on cache hit
    globalThis.fetch = vi.fn() as unknown as typeof globalThis.fetch;

    const result = await fetchArticlesApi('get', 'fetchArticles', { page: '1', limit: '10' });

    expect(result).toBeTruthy();
    expect(result.cacheControl).toBe('max-age=60');
    expect(redisGet).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('returns fallback empty response when auth fetch throws', async () => {
    redisGet.mockResolvedValueOnce(null);

    globalThis.fetch = vi.fn().mockRejectedValue(new Error('network error')) as unknown as typeof globalThis.fetch;

    const resultPromise = fetchArticlesApi('get', 'fetchArticles', { page: '1', limit: '10' });
    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(result.articles).toEqual([]);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(0);
    expect(result.totalArticles).toBe(0);
    expect(result.cacheControl).toBe('no-cache');
  });

  it('returns fallback empty response when entries fetch returns non-ok', async () => {
    redisGet.mockResolvedValueOnce(null);

    const authResponse = { ok: true, json: async () => ({ access_token: 'token' }) };
    const badResponse = { ok: false, status: 500, statusText: 'Internal Server Error' };

    globalThis.fetch = vi.fn().mockResolvedValueOnce(authResponse).mockResolvedValue(badResponse) as unknown as typeof globalThis.fetch;

    const resultPromise = fetchArticlesApi('get', 'fetchArticles', { page: '2', limit: '5' });
    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(result.articles).toEqual([]);
    expect(result.currentPage).toBe(2);
    expect(result.cacheControl).toBe('no-cache');
  });

  it('filters out articles with no matching tags', async () => {
    redisGet.mockResolvedValueOnce(null);

    const entriesJson = {
      _embedded: {
        items: [
          {
            title: 'Untagged Post',
            url: 'https://example.com/untagged',
            domain_name: 'example.com',
            hashed_url: 'hash99',
            reading_time: 2,
            preview_picture: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            archived_at: null,
            tags: [{ id: 2, label: 'cooking', slug: 'cooking' }],
          },
        ],
      },
      page: 1,
      pages: 1,
      total: 1,
      limit: 10,
    };

    const authResponse = { ok: true, json: async () => ({ access_token: 'token' }) };
    const pageResponse = {
      ok: true,
      headers: { get: () => null },
      json: async () => entriesJson,
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce(authResponse).mockResolvedValueOnce(pageResponse) as unknown as typeof globalThis.fetch;

    const result = await fetchArticlesApi('get', 'fetchArticles', { page: '1', limit: '10' });

    expect(result.articles).toEqual([]);
    expect(result.totalArticles).toBe(1);
    expect(redisSetWithExpiry).not.toHaveBeenCalled();
  });

  it('clamps perPage to PAGE_SIZE when limit is out of range', async () => {
    redisGet.mockResolvedValueOnce(null);

    const entriesJson = { _embedded: { items: [] }, page: 1, pages: 0, total: 0, limit: 10 };
    const authResponse = { ok: true, json: async () => ({ access_token: 'token' }) };
    const pageResponse = { ok: true, headers: { get: () => null }, json: async () => entriesJson };

    const fetchMock = vi.fn().mockResolvedValueOnce(authResponse).mockResolvedValueOnce(pageResponse);
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    await fetchArticlesApi('get', 'fetchArticles', { page: '1', limit: '999' });

    const calledUrl: string = fetchMock.mock.calls[1][0] as string;
    expect(calledUrl).toContain('perPage=10');
  });

  it('fetches from API and stores in cache on cache miss', async () => {
    // Cache miss
    redisGet.mockResolvedValueOnce(null);

    // Mock fetch for auth and entries
    const authResponse: MockResponse<{ access_token: string }> = {
      ok: true,
      json: async () => ({ access_token: 'token' }),
    };

    const entriesJson = makeWallabagResponse();
    const pageResponse: MockResponse<ReturnType<typeof makeWallabagResponse>> = {
      ok: true,
      headers: { get: (k: string) => (k.toLowerCase() === 'cache-control' ? 'max-age=120' : null) },
      json: async () => entriesJson,
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(authResponse) // oauth token
      .mockResolvedValueOnce(pageResponse); // entries

    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    const result = await fetchArticlesApi('get', 'fetchArticles', { page: '1', limit: '10' });

    expect(result).toBeTruthy();
    expect(result.cacheControl).toBe('max-age=120');
    expect(result.articles.length).toBeGreaterThan(0);
    expect(result.articles[0].domain_name).toBe('example.com');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(redisSetWithExpiry).toHaveBeenCalled();
  });
});
