import { beforeEach, describe, expect, it, vi } from 'vitest';

const scrapeItMock = vi.fn();
const redisGetMock = vi.fn();
const redisTtlMock = vi.fn();
const redisSetWithExpiryMock = vi.fn();

vi.mock('scrape-it', () => ({ default: (...args: unknown[]) => scrapeItMock(...args) }));

vi.mock('$lib/server/redis', () => ({
  redisService: {
    get: (d: unknown) => redisGetMock(d),
    ttl: (d: unknown) => redisTtlMock(d),
    setWithExpiry: (d: unknown) => redisSetWithExpiryMock(d),
    set: vi.fn(),
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

vi.mock('$lib/util/retry', () => ({
  retryWithBackoff: (fn: () => Promise<unknown>) => fn(),
}));

import { GET } from './+server.js';

const makeAlbum = () => ({
  url: 'https://bandcamp.com/album/123',
  artwork: 'https://img.bandcamp.com/art.jpg',
  title: 'Test Album',
  artist: 'Test Artist',
});

function makeRequestEvent() {
  const capturedHeaders: Record<string, string> = {};
  const event = {
    setHeaders: (h: Record<string, string>) => Object.assign(capturedHeaders, h),
  } as unknown as Parameters<typeof GET>[0];
  return { event, capturedHeaders };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('GET /api/bandcamp/albums', () => {
  it('returns cached albums with TTL-based cache-control', async () => {
    const cached = [makeAlbum()];
    redisGetMock.mockResolvedValueOnce(JSON.stringify(cached));
    redisTtlMock.mockResolvedValueOnce(3600);

    const { event, capturedHeaders } = makeRequestEvent();
    const response = await GET(event);
    const body = await response.json();

    expect(body).toHaveLength(1);
    expect(body[0].title).toBe('Test Album');
    expect(capturedHeaders['cache-control']).toBe('max-age=3600');
    expect(scrapeItMock).not.toHaveBeenCalled();
  });

  it('returns cached albums with fallback cache-control when no TTL', async () => {
    const cached = [makeAlbum()];
    redisGetMock.mockResolvedValueOnce(JSON.stringify(cached));
    redisTtlMock.mockResolvedValueOnce(0);

    const { event, capturedHeaders } = makeRequestEvent();
    await GET(event);

    expect(capturedHeaders['cache-control']).toBe('max-age=43200');
  });

  it('scrapes and returns albums on cache miss', async () => {
    redisGetMock.mockResolvedValueOnce(null);
    scrapeItMock.mockResolvedValueOnce({ data: { collectionItems: [makeAlbum()] } });

    const { event, capturedHeaders } = makeRequestEvent();
    const response = await GET(event);
    const body = await response.json();

    expect(body).toHaveLength(1);
    expect(body[0].artist).toBe('Test Artist');
    expect(capturedHeaders['cache-control']).toBe('max-age=43200');
    expect(redisSetWithExpiryMock).toHaveBeenCalledOnce();
  });

  it('returns empty array when scrape returns no items', async () => {
    redisGetMock.mockResolvedValueOnce(null);
    scrapeItMock.mockResolvedValueOnce({ data: { collectionItems: [] } });

    const { event } = makeRequestEvent();
    const response = await GET(event);
    const body = await response.json();

    expect(body).toEqual([]);
    expect(redisSetWithExpiryMock).not.toHaveBeenCalled();
  });

  it('returns empty array when scrape throws', async () => {
    redisGetMock.mockResolvedValueOnce(null);
    scrapeItMock.mockRejectedValueOnce(new Error('scrape failed'));

    const { event } = makeRequestEvent();
    const response = await GET(event);
    const body = await response.json();

    expect(body).toEqual([]);
  });
});
