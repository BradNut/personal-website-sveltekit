import { beforeEach, describe, expect, it, vi } from 'vitest';

const fetchAlbumsMock = vi.fn();
vi.mock('$lib/services/bandcampApi', () => ({
  fetchAlbums: (...args: unknown[]) => fetchAlbumsMock(...args),
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
  it('returns the albums from fetchAlbums and sets the cache-control header', async () => {
    fetchAlbumsMock.mockResolvedValueOnce({ albums: [makeAlbum()], cacheControl: 'max-age=3600' });

    const { event, capturedHeaders } = makeRequestEvent();
    const response = await GET(event);
    const body = await response.json();

    expect(body).toHaveLength(1);
    expect(body[0].title).toBe('Test Album');
    expect(capturedHeaders['cache-control']).toBe('max-age=3600');
  });

  it('returns an empty array with no-cache when fetchAlbums yields no albums', async () => {
    fetchAlbumsMock.mockResolvedValueOnce({ albums: [], cacheControl: 'no-cache' });

    const { event, capturedHeaders } = makeRequestEvent();
    const response = await GET(event);
    const body = await response.json();

    expect(body).toEqual([]);
    expect(capturedHeaders['cache-control']).toBe('no-cache');
  });
});
