import { beforeEach, describe, expect, it, vi } from 'vitest';

const scrapeItMock = vi.fn();
const redisGet = vi.fn();
const redisTtl = vi.fn();
const redisSetWithExpiry = vi.fn();

vi.mock('varlock/env', () => ({
  initVarlockEnv: vi.fn(),
  ENV: {
    USE_REDIS_CACHE: true,
    BANDCAMP_USERNAME: 'testuser',
  },
}));

vi.mock('scrape-it', () => ({ default: (...args: unknown[]) => scrapeItMock(...args) }));

vi.mock('$lib/server/redis', () => ({
  redisService: {
    get: (d: unknown) => redisGet(d),
    ttl: (d: unknown) => redisTtl(d),
    setWithExpiry: (d: unknown) => redisSetWithExpiry(d),
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

import { fetchAlbums } from './bandcampApi';

const makeAlbum = () => ({
  url: 'https://bandcamp.com/album/123',
  artwork: 'https://img.bandcamp.com/art.jpg',
  title: 'Test Album',
  artist: 'Test Artist',
});

beforeEach(() => {
  vi.resetAllMocks();
});

describe('fetchAlbums', () => {
  it('returns cached albums with TTL-derived cache-control on cache hit', async () => {
    redisGet.mockResolvedValueOnce(JSON.stringify([makeAlbum()]));
    redisTtl.mockResolvedValueOnce(3600);

    const result = await fetchAlbums();

    expect(result.albums).toHaveLength(1);
    expect(result.albums[0].title).toBe('Test Album');
    expect(result.cacheControl).toBe('max-age=3600');
    expect(scrapeItMock).not.toHaveBeenCalled();
  });

  it('falls back to max-age=43200 on cache hit when TTL is missing', async () => {
    redisGet.mockResolvedValueOnce(JSON.stringify([makeAlbum()]));
    redisTtl.mockResolvedValueOnce(0);

    const result = await fetchAlbums();

    expect(result.cacheControl).toBe('max-age=43200');
  });

  it('scrapes, stores, and returns albums on cache miss', async () => {
    redisGet.mockResolvedValueOnce(null);
    scrapeItMock.mockResolvedValueOnce({ data: { collectionItems: [makeAlbum()] } });

    const result = await fetchAlbums();

    expect(result.albums).toHaveLength(1);
    expect(result.albums[0].artist).toBe('Test Artist');
    expect(result.cacheControl).toBe('max-age=43200');
    expect(redisSetWithExpiry).toHaveBeenCalledOnce();
  });

  it('returns empty albums with no-cache and skips store when scrape is empty', async () => {
    redisGet.mockResolvedValueOnce(null);
    scrapeItMock.mockResolvedValueOnce({ data: { collectionItems: [] } });

    const result = await fetchAlbums();

    expect(result.albums).toEqual([]);
    expect(result.cacheControl).toBe('no-cache');
    expect(redisSetWithExpiry).not.toHaveBeenCalled();
  });

  it('returns empty albums with no-cache when scrape throws', async () => {
    redisGet.mockResolvedValueOnce(null);
    scrapeItMock.mockRejectedValueOnce(new Error('scrape failed'));

    const result = await fetchAlbums();

    expect(result.albums).toEqual([]);
    expect(result.cacheControl).toBe('no-cache');
  });
});
