import { describe, expect, it, vi } from 'vitest';

// Mock env to avoid relying on GitHub secrets and to disable Redis usage
vi.mock('$env/static/private', () => ({
  BANDCAMP_USERNAME: 'testuser',
  USE_REDIS_CACHE: 'false',
}));

// Stub Redis client so no real connection is attempted
vi.mock('$lib/server/redis', () => ({
  redis: {
    get: vi.fn(async () => null),
    set: vi.fn(async () => 'OK'),
    ttl: vi.fn(async () => 0),
  },
}));

// Mock scrape-it to avoid real network calls to Bandcamp
vi.mock('scrape-it', () => ({
  default: vi.fn(async () => ({
    data: {
      collectionItems: [
        {
          url: 'https://bandcamp.com/album/123',
          artwork: 'https://img.bandcamp.com/art.jpg',
          title: 'Test Album',
          artist: 'Test Artist',
        },
      ],
    },
  })),
}));

import { fetchBandcampAlbums } from './fetchBandcampAlbums';

describe('fetchBandcampAlbums (mocked)', () => {
  it('returns albums from mocked scrape-it', async () => {
    const albums = await fetchBandcampAlbums();
    expect(albums).toBeTruthy();
    expect(albums?.length).toBeGreaterThan(0);
    const [album] = albums;
    expect(album.artist).toBe('Test Artist');
    expect(album.title).toBe('Test Album');
    expect(album.url).toBe('https://bandcamp.com/album/123');
    expect(album.artwork).toBe('https://img.bandcamp.com/art.jpg');
  });
});
