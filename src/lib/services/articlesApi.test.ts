import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cacheFailures, timed } from '$lib/server/testing/fakeIoredis';

// Mock varlock/env used by the service
vi.mock('varlock/env', () => ({
  initVarlockEnv: vi.fn(),
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

// Fake the ioredis boundary so the real redisService (and its fail-open handling) runs
const { fake } = await vi.hoisted(async () => {
  const { createFakeIoredis } = await import('$lib/server/testing/fakeIoredis');
  return { fake: createFakeIoredis() };
});
vi.mock('ioredis', () => ({ Redis: fake.Redis }));
vi.mock('$app/environment', () => ({ building: false }));
const redisGet = fake.commands.get;
const redisSetWithExpiry = fake.commands.set;
const redisTtl = fake.commands.ttl;

// The service keeps module-level state (access token, cool-down), so load a fresh copy per test.
let fetchArticles: typeof import('./articlesApi').fetchArticles;

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

beforeEach(async () => {
  vi.resetModules();
  ({ fetchArticles } = await import('./articlesApi'));
  vi.useFakeTimers();
  redisGet.mockReset();
  redisSetWithExpiry.mockReset();
  redisTtl.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
  globalThis.fetch = originalFetch;
});

describe('fetchArticles', () => {
  it('returns cached response with cacheControl on cache hit', async () => {
    const cached = makeCachedResponse();
    redisGet.mockResolvedValueOnce(JSON.stringify(cached));
    redisTtl.mockResolvedValueOnce(60);

    // fetch should not be called on cache hit
    globalThis.fetch = vi.fn() as unknown as typeof globalThis.fetch;

    const result = await fetchArticles({ page: '1', limit: '10' });

    expect(result).toBeTruthy();
    expect(result.cacheControl).toBe('max-age=60');
    expect(redisGet).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  for (const ttl of [0, -1, -2]) {
    it(`returns no-cache on cache hit when the TTL is ${ttl}`, async () => {
      redisGet.mockResolvedValueOnce(JSON.stringify(makeCachedResponse()));
      redisTtl.mockResolvedValueOnce(ttl);
      globalThis.fetch = vi.fn() as unknown as typeof globalThis.fetch;

      const result = await fetchArticles({ page: '1', limit: '10' });

      expect(result.cacheControl).toBe('no-cache');
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });
  }

  it('returns fallback empty response when auth fetch throws', async () => {
    redisGet.mockResolvedValueOnce(null);

    globalThis.fetch = vi.fn().mockRejectedValue(new Error('network error')) as unknown as typeof globalThis.fetch;

    const resultPromise = fetchArticles({ page: '1', limit: '10' });
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

    globalThis.fetch = vi.fn().mockResolvedValueOnce(authResponse).mockResolvedValue(badResponse);

    const resultPromise = fetchArticles({ page: '2', limit: '5' });
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

    globalThis.fetch = vi.fn().mockResolvedValueOnce(authResponse).mockResolvedValueOnce(pageResponse);

    const result = await fetchArticles({ page: '1', limit: '10' });

    expect(result.articles).toEqual([]);
    expect(result.totalArticles).toBe(1);
    expect(redisSetWithExpiry).not.toHaveBeenCalled();
  });

  it('publishes articles whose t: prefixed tag slugs match an allowed tag, showing tags without the prefix', async () => {
    redisGet.mockResolvedValueOnce(null);

    const entriesJson = makeWallabagResponse();
    entriesJson._embedded.items[0].tags = [
      { id: 1, label: 'Programming', slug: 't:programming' },
      { id: 2, label: 'Cooking', slug: 't:cooking' },
    ];
    const pageResponse = { ok: true, headers: { get: () => null }, json: async () => entriesJson };
    globalThis.fetch = vi.fn().mockResolvedValueOnce(authOk()).mockResolvedValueOnce(pageResponse);

    const result = await fetchArticles({ page: '1', limit: '10' });

    expect(result.articles).toHaveLength(1);
    expect(result.articles[0].tags).toEqual(['programming', 'cooking']);
  });

  it('skips an entry with no tags without failing the page', async () => {
    redisGet.mockResolvedValueOnce(null);

    const wallabagResponse = makeWallabagResponse();
    const tagged = wallabagResponse._embedded.items[0];
    const { tags: _tags, ...untagged } = { ...tagged, title: 'No tags', hashed_url: 'hash-none' };
    const entriesJson = { ...wallabagResponse, _embedded: { items: [untagged, tagged] } };
    const pageResponse = { ok: true, headers: { get: () => null }, json: async () => entriesJson };
    globalThis.fetch = vi.fn().mockResolvedValueOnce(authOk()).mockResolvedValueOnce(pageResponse);

    const result = await fetchArticles({ page: '1', limit: '10' });

    expect(result.articles.map((article) => article.title)).toEqual(['Article 1']);
  });

  it('marks the result no-cache and skips Redis when every entry is filtered out, even if Wallabag says cacheable', async () => {
    redisGet.mockResolvedValueOnce(null);

    const entriesJson = makeWallabagResponse();
    entriesJson._embedded.items[0].tags = [{ id: 2, label: 'Cooking', slug: 't:cooking' }];
    const pageResponse = {
      ok: true,
      headers: { get: (k: string) => (k.toLowerCase() === 'cache-control' ? 'max-age=120' : null) },
      json: async () => entriesJson,
    };
    globalThis.fetch = vi.fn().mockResolvedValueOnce(authOk()).mockResolvedValueOnce(pageResponse);

    const result = await fetchArticles({ page: '1', limit: '10' });

    expect(result.articles).toEqual([]);
    expect(result.cacheControl).toBe('no-cache');
    expect(redisSetWithExpiry).not.toHaveBeenCalled();
  });

  it('clamps perPage to PAGE_SIZE when limit is out of range', async () => {
    redisGet.mockResolvedValueOnce(null);

    const entriesJson = { _embedded: { items: [] }, page: 1, pages: 0, total: 0, limit: 10 };
    const authResponse = { ok: true, json: async () => ({ access_token: 'token' }) };
    const pageResponse = { ok: true, headers: { get: () => null }, json: async () => entriesJson };

    const fetchMock = vi.fn().mockResolvedValueOnce(authResponse).mockResolvedValueOnce(pageResponse);
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    await fetchArticles({ page: '1', limit: '999' });

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

    const result = await fetchArticles({ page: '1', limit: '10' });

    expect(result).toBeTruthy();
    expect(result.cacheControl).toBe('max-age=120');
    expect(result.articles.length).toBeGreaterThan(0);
    expect(result.articles[0].domain_name).toBe('example.com');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(redisSetWithExpiry).toHaveBeenCalled();
  });
});

const authOk = (expiresIn?: number) => ({
  ok: true,
  json: async () => ({ access_token: 'token', ...(expiresIn ? { expires_in: expiresIn } : {}) }),
});
const entriesOk = () => ({ ok: true, headers: { get: () => null }, json: async () => makeWallabagResponse() });
const timeoutError = () => Object.assign(new Error('The operation was aborted due to timeout'), { name: 'TimeoutError' });

describe('fetchArticles — Wallabag auth and failure handling', () => {
  beforeEach(() => {
    redisGet.mockResolvedValue(null);
  });

  it('reuses the access token until it expires', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(authOk(3600)).mockResolvedValueOnce(entriesOk()).mockResolvedValueOnce(entriesOk());
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    await fetchArticles({ page: '1', limit: '10' });
    await fetchArticles({ page: '2', limit: '10' });

    const tokenCalls = fetchMock.mock.calls.filter(([url]) => String(url).includes('/oauth/v2/token'));
    expect(tokenCalls).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('logs in again once the token has expired', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(authOk(3600))
      .mockResolvedValueOnce(entriesOk())
      .mockResolvedValueOnce(authOk(3600))
      .mockResolvedValueOnce(entriesOk());
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    await fetchArticles({ page: '1', limit: '10' });
    vi.advanceTimersByTime(3600 * 1000);
    await fetchArticles({ page: '1', limit: '10' });

    const tokenCalls = fetchMock.mock.calls.filter(([url]) => String(url).includes('/oauth/v2/token'));
    expect(tokenCalls).toHaveLength(2);
  });

  it('shares one login between concurrent requests', async () => {
    const fetchMock = vi.fn((url: string) => Promise.resolve(String(url).includes('/oauth/v2/token') ? authOk(3600) : entriesOk()));
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    await Promise.all([fetchArticles({ page: '1', limit: '3' }), fetchArticles({ page: '1', limit: '10' })]);

    const tokenCalls = fetchMock.mock.calls.filter(([url]) => String(url).includes('/oauth/v2/token'));
    expect(tokenCalls).toHaveLength(1);
  });

  it('logs in again once when a reused token is rejected with 401', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(authOk(3600))
      .mockResolvedValueOnce(entriesOk())
      .mockResolvedValueOnce({ ok: false, status: 401, statusText: 'Unauthorized' })
      .mockResolvedValueOnce(authOk(3600))
      .mockResolvedValueOnce(entriesOk());
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    await fetchArticles({ page: '1', limit: '10' });
    const result = await fetchArticles({ page: '1', limit: '10' });

    expect(result.articles.length).toBeGreaterThan(0);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it('does not retry a timed-out login', async () => {
    const fetchMock = vi.fn().mockRejectedValue(timeoutError());
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    const resultPromise = fetchArticles({ page: '1', limit: '10' });
    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(result.articles).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not retry a login rejected with a 4xx', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 400, statusText: 'Bad Request' });
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    const resultPromise = fetchArticles({ page: '1', limit: '10' });
    await vi.runAllTimersAsync();
    await resultPromise;

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries a login that fails with a 5xx', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503, statusText: 'Service Unavailable' })
      .mockResolvedValueOnce(authOk(3600))
      .mockResolvedValueOnce(entriesOk());
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    const resultPromise = fetchArticles({ page: '1', limit: '10' });
    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(result.articles.length).toBeGreaterThan(0);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('skips Wallabag for 5 minutes after a failure, then tries again', async () => {
    const fetchMock = vi.fn().mockRejectedValueOnce(timeoutError()).mockResolvedValueOnce(authOk(3600)).mockResolvedValueOnce(entriesOk());
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    const first = fetchArticles({ page: '1', limit: '10' });
    await vi.runAllTimersAsync();
    await first;
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const duringCooldown = await fetchArticles({ page: '1', limit: '10' });
    expect(duringCooldown.articles).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(5 * 60 * 1000);
    const afterCooldown = await fetchArticles({ page: '1', limit: '10' });
    expect(afterCooldown.articles.length).toBeGreaterThan(0);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('still serves cached articles during the cool-down', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(timeoutError()) as unknown as typeof globalThis.fetch;
    const first = fetchArticles({ page: '1', limit: '10' });
    await vi.runAllTimersAsync();
    await first;

    redisGet.mockResolvedValueOnce(JSON.stringify(makeCachedResponse()));
    redisTtl.mockResolvedValueOnce(60);
    const result = await fetchArticles({ page: '1', limit: '10' });

    expect(result.cacheControl).toBe('max-age=60');
  });
});

describe('fetchArticles — Redis unavailable', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  for (const [failure, command] of Object.entries(cacheFailures)) {
    it(`serves fresh articles within a second when the cache read ${failure}`, async () => {
      redisGet.mockImplementation(command);
      globalThis.fetch = vi.fn().mockResolvedValueOnce(authOk(3600)).mockResolvedValueOnce(entriesOk()) as unknown as typeof globalThis.fetch;

      const { value, elapsedMs } = await timed(fetchArticles({ page: '1', limit: '10' }));

      expect(value.articles.length).toBeGreaterThan(0);
      expect(elapsedMs).toBeLessThanOrEqual(1000);
    });

    it(`still returns the fetched articles when the cache write ${failure}`, async () => {
      redisGet.mockResolvedValue(null);
      redisSetWithExpiry.mockImplementation(command);
      globalThis.fetch = vi.fn().mockResolvedValueOnce(authOk(3600)).mockResolvedValueOnce(entriesOk()) as unknown as typeof globalThis.fetch;

      const { value, elapsedMs } = await timed(fetchArticles({ page: '1', limit: '10' }));

      expect(value.articles.length).toBeGreaterThan(0);
      expect(value.totalArticles).toBe(1);
      expect(elapsedMs).toBeLessThanOrEqual(1000);
    });

    it(`does not start the Wallabag cool-down when the cache ${failure}`, async () => {
      redisGet.mockImplementation(command);
      redisSetWithExpiry.mockImplementation(command);
      const fetchMock = vi.fn().mockResolvedValueOnce(authOk(3600)).mockResolvedValue(entriesOk());
      globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

      await timed(fetchArticles({ page: '1', limit: '10' }));
      const { value } = await timed(fetchArticles({ page: '1', limit: '10' }));

      expect(value.articles.length).toBeGreaterThan(0);
      expect(fetchMock).toHaveBeenCalledTimes(3); // login once, entries on both requests
    });
  }
});
