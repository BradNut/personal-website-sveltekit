import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock private env used by the service
vi.mock('$env/static/private', () => ({
  PAGE_SIZE: '10',
  USE_REDIS_CACHE: 'true',
  WALLABAG_CLIENT_ID: 'cid',
  WALLABAG_CLIENT_SECRET: 'csecret',
  WALLABAG_PASSWORD: 'pw',
  WALLABAG_URL: 'https://example.com',
  WALLABAG_USERNAME: 'user',
}));

// Mock redis client
const redisGet = vi.fn();
const redisSet = vi.fn();
const redisTtl = vi.fn();
vi.mock('$lib/server/redis', () => ({
  redis: {
    get: (key: string) => redisGet(key),
    set: (key: string, value: string, mode: 'EX', seconds: number) => redisSet(key, value, mode, seconds),
    ttl: (key: string) => redisTtl(key),
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
  redisSet.mockReset();
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
    expect(global.fetch).not.toHaveBeenCalled();
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
    expect(redisSet).toHaveBeenCalled();
  });
});
