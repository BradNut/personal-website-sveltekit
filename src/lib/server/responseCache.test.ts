import { beforeEach, describe, expect, it, vi } from 'vitest';

const redisGet = vi.fn();
const redisSetWithExpiry = vi.fn();
const redisTtl = vi.fn();

vi.mock('$lib/server/redis', () => ({
  REDIS_PREFIXES: {
    ARTICLES: 'articles',
    BANDCAMP_ALBUMS: 'bandcampAlbums',
    PAGE_CACHE: 'pageCache',
  },
  redisService: {
    get: (data: { prefix: string; key: string }) => redisGet(data),
    setWithExpiry: (data: { prefix: string; key: string; value: string; expiry: number }) => redisSetWithExpiry(data),
    ttl: (data: { prefix: string; key: string }) => redisTtl(data),
  },
}));

import { readCachedJson, writeCachedJson } from './responseCache';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('response cache', () => {
  it('returns cached JSON with TTL-derived cache-control', async () => {
    redisGet.mockResolvedValueOnce(JSON.stringify({ albums: ['Blue Rev'] }));
    redisTtl.mockResolvedValueOnce(3600);

    const result = await readCachedJson<{ albums: string[] }>({
      enabled: true,
      prefix: 'bandcampAlbums',
      key: 'albums',
    });

    expect(result).toEqual({
      hit: true,
      value: { albums: ['Blue Rev'] },
      cacheControl: 'max-age=3600',
    });
  });

  it('returns cached JSON with fallback cache-control when TTL is unavailable', async () => {
    redisGet.mockResolvedValueOnce(JSON.stringify({ albums: ['Blue Rev'] }));
    redisTtl.mockResolvedValueOnce(0);

    const result = await readCachedJson<{ albums: string[] }>({
      enabled: true,
      prefix: 'bandcampAlbums',
      key: 'albums',
      fallbackTtl: 43200,
    });

    expect(result).toEqual({
      hit: true,
      value: { albums: ['Blue Rev'] },
      cacheControl: 'max-age=43200',
    });
  });

  it('returns a miss with fallback cache-control when cached JSON is absent', async () => {
    redisGet.mockResolvedValueOnce(null);

    const result = await readCachedJson<{ albums: string[] }>({
      enabled: true,
      prefix: 'bandcampAlbums',
      key: 'albums',
      fallbackTtl: 43200,
    });

    expect(result).toEqual({
      hit: false,
      cacheControl: 'max-age=43200',
    });
  });

  it('returns a miss without reading Redis when caching is disabled', async () => {
    const result = await readCachedJson<{ albums: string[] }>({
      enabled: false,
      prefix: 'bandcampAlbums',
      key: 'albums',
      fallbackTtl: 43200,
    });

    expect(result).toEqual({
      hit: false,
      cacheControl: 'max-age=43200',
    });
    expect(redisGet).not.toHaveBeenCalled();
  });

  it('returns a miss with fallback cache-control when Redis is unavailable', async () => {
    redisGet.mockRejectedValueOnce(new Error('redis down'));

    const result = await readCachedJson<{ albums: string[] }>({
      enabled: true,
      prefix: 'bandcampAlbums',
      key: 'albums',
      fallbackTtl: 43200,
    });

    expect(result).toEqual({
      hit: false,
      cacheControl: 'max-age=43200',
    });
  });

  it('writes JSON with standard expiry when caching is enabled', async () => {
    await writeCachedJson({
      enabled: true,
      prefix: 'bandcampAlbums',
      key: 'albums',
      value: [{ title: 'Test Album' }],
      ttl: 43200,
    });

    expect(redisSetWithExpiry).toHaveBeenCalledWith({
      prefix: 'bandcampAlbums',
      key: 'albums',
      value: JSON.stringify([{ title: 'Test Album' }]),
      expiry: 43200,
    });
  });
});
