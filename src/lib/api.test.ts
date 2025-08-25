import { beforeEach, describe, expect, it, vi } from 'vitest';

// Hoisted mocks to satisfy Vitest's module mock hoisting
const hoisted = vi.hoisted(() => {
  return {
    redisMock: {
      get: vi.fn(),
      set: vi.fn(),
      ttl: vi.fn(),
    },
  } as const;
});

// Mock env constants used by fetchArticlesApi
vi.mock('$env/static/private', () => ({
  PAGE_SIZE: '10',
  USE_REDIS_CACHE: 'true', // enable cache to test both hit/miss paths with stubs
  WALLABAG_CLIENT_ID: 'client-id',
  WALLABAG_CLIENT_SECRET: 'client-secret',
  WALLABAG_PASSWORD: 'password',
  WALLABAG_URL: 'https://wallabag.example',
  WALLABAG_USERNAME: 'username',
}));

// Mock redis client so no real connection is used
vi.mock('$lib/server/redis', () => ({
  redis: hoisted.redisMock,
}));

// Helper to mock global fetch responses
function makeJsonResponse<T>(data: T, headers: Record<string, string> = {}) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: { get: (k: string) => headers[k.toLowerCase()] ?? null },
    json: async () => data,
  } as const;
}

// Import after mocks are set up
import { fetchArticlesApi } from './api';

describe('fetchArticlesApi (unit, mocked)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches and maps articles on cache miss, then stores in redis', async () => {
    // Cache miss setup
    hoisted.redisMock.get.mockResolvedValueOnce(null);
    hoisted.redisMock.ttl.mockResolvedValueOnce(0);

    // Mock token fetch
    const token = { access_token: 'access-token' } as const;
    // Mock entries fetch
    const wallabagResponse = {
      _embedded: {
        items: [
          {
            title: 'Great Post',
            url: 'https://example.com/post',
            domain_name: 'www.example.com',
            hashed_url: 'hash123',
            reading_time: 7,
            preview_picture: 'https://example.com/img.jpg',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
            archived_at: null,
            tags: [{ slug: 'programming' }],
          },
        ],
      },
      page: 1,
      pages: 5,
      total: 100,
      limit: 10,
    } as const;

    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);
      if (url.endsWith('/oauth/v2/token')) {
        return makeJsonResponse(token);
      }
      if (url.startsWith('https://wallabag.example/api/entries.json')) {
        return makeJsonResponse(wallabagResponse, { 'cache-control': 'max-age=60' });
      }
      throw new Error('Unexpected fetch to ' + url);
    });
    // @ts-expect-error assign to global
    global.fetch = fetchMock;

    const result = await fetchArticlesApi('GET', 'entries', { page: '1', limit: '10' });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(5);
    expect(result.limit).toBe(10);
    expect(result.totalArticles).toBe(100);
    expect(result.cacheControl).toBe('max-age=60');

    expect(result.articles.length).toBe(1);
    const article = result.articles[0];
    expect(article.title).toBe('Great Post');
    expect(article.url).toBeInstanceOf(URL);
    expect(article.url.hostname).toBe('example.com');
    expect(article.domain_name).toBe('example.com');

    // Stored in Redis with EX for 12 hours
    expect(hoisted.redisMock.set).toHaveBeenCalled();
    const setArgs = (hoisted.redisMock.set as unknown as { mock: { calls: unknown[][] } }).mock
      .calls[0] as [string, string, 'EX', number];
    expect(setArgs[0]).toContain('perPage=10');
    expect(setArgs[0]).toContain('page=1');
    expect(setArgs[2]).toBe('EX');
    expect(setArgs[3]).toBe(43200);
  });

  it('returns cached response and cacheControl when redis has value (cache hit)', async () => {
    const cached = {
      articles: [],
      currentPage: 2,
      totalPages: 3,
      limit: 10,
      totalArticles: 20,
    };

    hoisted.redisMock.get.mockResolvedValueOnce(JSON.stringify(cached));
    hoisted.redisMock.ttl.mockResolvedValueOnce(321);

    const fetchMock = vi.fn();
    // @ts-expect-error assign to global
    global.fetch = fetchMock;

    const result = await fetchArticlesApi('GET', 'entries', { page: '2', limit: '10' });

    // No network calls on cache hit
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.currentPage).toBe(2);
    expect(result.totalPages).toBe(3);
    expect(result.limit).toBe(10);
    expect(result.totalArticles).toBe(20);
    expect(result.cacheControl).toBe('max-age=321');
  });
});
