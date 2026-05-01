import { beforeEach, describe, expect, it, vi } from 'vitest';

const scrapeItMock = vi.fn();
const redisGetMock = vi.fn();
const redisTtlMock = vi.fn();
const redisSetWithExpiryMock = vi.fn();

vi.mock('$env/static/private', () => ({
  BANDCAMP_USERNAME: 'testuser',
  USE_REDIS_CACHE: 'true',
}));

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

vi.mock('scrape-it', () => ({ default: (...args: unknown[]) => scrapeItMock(...args) }));

import { fetchBandcampAlbums } from './fetchBandcampAlbums';

const makeAlbum = () => ({
  url: 'https://bandcamp.com/album/123',
  artwork: 'https://img.bandcamp.com/art.jpg',
  title: 'Test Album',
  artist: 'Test Artist',
});

beforeEach(() => {
  vi.resetAllMocks();
});

describe('fetchBandcampAlbums (mocked)', () => {
  it('returns albums from scrape-it on cache miss', async () => {
    redisGetMock.mockResolvedValueOnce(null);
    scrapeItMock.mockResolvedValueOnce({ data: { collectionItems: [makeAlbum()] } });

    const albums = await fetchBandcampAlbums();

    expect(albums.length).toBe(1);
    expect(albums[0].artist).toBe('Test Artist');
    expect(redisSetWithExpiryMock).toHaveBeenCalledOnce();
  });

  it('returns cached albums on cache hit', async () => {
    const cached = [makeAlbum()];
    redisGetMock.mockResolvedValueOnce(JSON.stringify(cached));
    redisTtlMock.mockResolvedValueOnce(3600);

    const albums = await fetchBandcampAlbums();

    expect(albums.length).toBe(1);
    expect(albums[0].title).toBe('Test Album');
    expect(scrapeItMock).not.toHaveBeenCalled();
    expect(redisSetWithExpiryMock).not.toHaveBeenCalled();
  });

  it('returns empty array when scrape-it throws', async () => {
    redisGetMock.mockResolvedValueOnce(null);
    scrapeItMock.mockRejectedValueOnce(new Error('scrape failed'));

    const albums = await fetchBandcampAlbums();

    expect(albums).toEqual([]);
  });

  it('returns empty array when scrape returns no items', async () => {
    redisGetMock.mockResolvedValueOnce(null);
    scrapeItMock.mockResolvedValueOnce({ data: { collectionItems: [] } });

    const albums = await fetchBandcampAlbums();

    expect(albums).toEqual([]);
    expect(redisSetWithExpiryMock).not.toHaveBeenCalled();
  });

  it('does not store in redis when scrape returns empty', async () => {
    redisGetMock.mockResolvedValueOnce(null);
    scrapeItMock.mockResolvedValueOnce({ data: {} });

    await fetchBandcampAlbums();

    expect(redisSetWithExpiryMock).not.toHaveBeenCalled();
  });
});
