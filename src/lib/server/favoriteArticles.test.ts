import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

const redisGet = vi.fn();
const redisSetWithExpiry = vi.fn();
const redisTtl = vi.fn();

vi.mock('$lib/server/redis', () => ({
  redisService: {
    get: (data: { prefix: string; key: string }) => redisGet(data),
    setWithExpiry: (data: { prefix: string; key: string; value: string; expiry: number }) => redisSetWithExpiry(data),
    ttl: (data: { prefix: string; key: string }) => redisTtl(data),
  },
  REDIS_PREFIXES: {
    ARTICLES: 'articles',
  },
}));

import { fetchFavoriteArticles } from './favoriteArticles';

type MockResponse<T> = {
  ok: boolean;
  status?: number;
  statusText?: string;
  headers?: { get: (key: string) => string | null };
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
  globalThis.fetch = vi.fn();
});

afterEach(() => {
  vi.useRealTimers();
  globalThis.fetch = originalFetch;
});

describe('fetchFavoriteArticles', () => {
  it('returns a cached article page through a small page query interface', async () => {
    redisGet.mockResolvedValueOnce(JSON.stringify(makeCachedResponse()));
    redisTtl.mockResolvedValueOnce(60);

    const result = await fetchFavoriteArticles({ page: '1', limit: '10' });

    expect(result).toMatchObject({ currentPage: 1, limit: 10, cacheControl: 'max-age=60' });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('returns mapped tagged articles and cache metadata on cache miss', async () => {
    redisGet.mockResolvedValueOnce(null);

    const authResponse: MockResponse<{ access_token: string }> = {
      ok: true,
      json: async () => ({ access_token: 'token' }),
    };
    const pageResponse: MockResponse<ReturnType<typeof makeWallabagResponse>> = {
      ok: true,
      headers: { get: (key: string) => (key.toLowerCase() === 'cache-control' ? 'max-age=120' : null) },
      json: async () => makeWallabagResponse(),
    };
    const fetchMock = vi.fn().mockResolvedValueOnce(authResponse).mockResolvedValueOnce(pageResponse);
    globalThis.fetch = fetchMock;

    const result = await fetchFavoriteArticles({ page: '1', limit: '10' });

    expect(result.cacheControl).toBe('max-age=120');
    expect(result.articles[0].domain_name).toBe('example.com');
    expect(redisSetWithExpiry).toHaveBeenCalled();
  });

  it('filters out articles without recognized favorite article tags', async () => {
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
    const authResponse: MockResponse<{ access_token: string }> = { ok: true, json: async () => ({ access_token: 'token' }) };
    const pageResponse: MockResponse<typeof entriesJson> = { ok: true, headers: { get: () => null }, json: async () => entriesJson };
    globalThis.fetch = vi.fn().mockResolvedValueOnce(authResponse).mockResolvedValueOnce(pageResponse);

    const result = await fetchFavoriteArticles({ page: '1', limit: '10' });

    expect(result.articles).toEqual([]);
    expect(result.totalArticles).toBe(1);
    expect(redisSetWithExpiry).not.toHaveBeenCalled();
  });

  it('clamps invalid limits to the configured page size', async () => {
    redisGet.mockResolvedValueOnce(null);

    const entriesJson = { _embedded: { items: [] }, page: 1, pages: 0, total: 0, limit: 10 };
    const authResponse: MockResponse<{ access_token: string }> = { ok: true, json: async () => ({ access_token: 'token' }) };
    const pageResponse: MockResponse<typeof entriesJson> = { ok: true, headers: { get: () => null }, json: async () => entriesJson };
    const fetchMock = vi.fn().mockResolvedValueOnce(authResponse).mockResolvedValueOnce(pageResponse);
    globalThis.fetch = fetchMock;

    await fetchFavoriteArticles({ page: '1', limit: '999' });

    expect(fetchMock.mock.calls[1][0]).toContain('perPage=10');
  });

  it('defaults missing pages to page one', async () => {
    redisGet.mockResolvedValueOnce(null);

    const entriesJson = { _embedded: { items: [] }, page: 1, pages: 0, total: 0, limit: 10 };
    const authResponse: MockResponse<{ access_token: string }> = { ok: true, json: async () => ({ access_token: 'token' }) };
    const pageResponse: MockResponse<typeof entriesJson> = { ok: true, headers: { get: () => null }, json: async () => entriesJson };
    const fetchMock = vi.fn().mockResolvedValueOnce(authResponse).mockResolvedValueOnce(pageResponse);
    globalThis.fetch = fetchMock;

    await fetchFavoriteArticles({ limit: '10' });

    expect(fetchMock.mock.calls[1][0]).toContain('page=1');
  });

  it('returns a fallback article page when Wallabag auth fails', async () => {
    redisGet.mockResolvedValueOnce(null);
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('network error'));

    const resultPromise = fetchFavoriteArticles({ page: '2', limit: '5' });
    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(result).toMatchObject({
      articles: [],
      currentPage: 2,
      totalPages: 0,
      totalArticles: 0,
      limit: 5,
      cacheControl: 'no-cache',
    });
  });
});
