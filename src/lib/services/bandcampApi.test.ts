import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { hang, timed } from '$lib/server/testing/fakeIoredis';

const scrapeItMock = vi.fn();

vi.mock('varlock/env', () => ({
  initVarlockEnv: vi.fn(),
  ENV: {
    USE_REDIS_CACHE: true,
    REDIS_URI: 'redis://test-host:6379',
    BANDCAMP_USERNAME: 'testuser',
  },
}));

vi.mock('scrape-it', () => ({ default: (...args: unknown[]) => scrapeItMock(...args) }));

// Fake the ioredis boundary so the real redisService (and its fail-open handling) runs
const { fake } = await vi.hoisted(async () => {
  const { createFakeIoredis } = await import('$lib/server/testing/fakeIoredis');
  return { fake: createFakeIoredis() };
});
vi.mock('ioredis', () => ({ Redis: fake.Redis }));
vi.mock('$app/environment', () => ({ building: false }));
const redisGet = fake.commands.get;
const redisTtl = fake.commands.ttl;
const redisSetWithExpiry = fake.commands.set;

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

describe('fetchAlbums — Redis unavailable', () => {
  const cacheFailures = {
    throws: () => Promise.reject(new Error('ECONNREFUSED')),
    'times out': hang,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  for (const [failure, command] of Object.entries(cacheFailures)) {
    it(`scrapes fresh albums within a second when the cache read ${failure}`, async () => {
      redisGet.mockImplementation(command);
      scrapeItMock.mockResolvedValueOnce({ data: { collectionItems: [makeAlbum()] } });

      const { value, elapsedMs } = await timed(fetchAlbums());

      expect(value.albums).toHaveLength(1);
      expect(elapsedMs).toBeLessThanOrEqual(1000);
    });

    it(`still returns the scraped albums when the cache write ${failure}`, async () => {
      redisGet.mockResolvedValue(null);
      redisSetWithExpiry.mockImplementation(command);
      scrapeItMock.mockResolvedValueOnce({ data: { collectionItems: [makeAlbum()] } });

      const { value, elapsedMs } = await timed(fetchAlbums());

      expect(value.albums).toHaveLength(1);
      expect(value.cacheControl).toBe('max-age=43200');
      expect(elapsedMs).toBeLessThanOrEqual(1000);
    });
  }
});
