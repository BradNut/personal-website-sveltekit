import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./$types', () => ({}));

import { load } from './+page.server.js';

const mockAlbums = [{ title: 'Album 1', url: 'https://bandcamp.com/1', artwork: '', artist: 'A' }];
const mockArticles = { articles: [], currentPage: 1, totalPages: 0, limit: 3, totalArticles: 0, cacheControl: 'no-cache' };

function makeLoadArgs(originUrl = 'http://localhost') {
  const capturedHeaders: Record<string, string> = {};
  const fetchMock = vi.fn()
    .mockResolvedValueOnce({ json: async () => mockAlbums })
    .mockResolvedValueOnce({ json: async () => mockArticles });

  const url = new URL('/', originUrl);
  return {
    args: {
      fetch: fetchMock,
      setHeaders: (h: Record<string, string>) => Object.assign(capturedHeaders, h),
      url,
      request: new Request(url),
      route: { id: '/' },
      params: {},
      isDataRequest: false,
      isSubRequest: false,
    } as unknown as Parameters<typeof load>[0],
    fetchMock,
    capturedHeaders,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('load (root page)', () => {
  it('fetches albums and articles, sets cache headers', async () => {
    const { args, fetchMock, capturedHeaders } = makeLoadArgs();
    const result = await load(args) as Record<string, unknown>;

    expect(fetchMock).toHaveBeenCalledWith('/api/bandcamp/albums');
    expect(fetchMock).toHaveBeenCalledWith('/api/articles?page=1&limit=3');
    expect(capturedHeaders['cache-control']).toBe('max-age=43200');
    expect(result.albums).toEqual(mockAlbums);
    expect(result.articlesData).toEqual(mockArticles);
    expect(result.baseUrl).toBe('http://localhost/');
    expect(result.metaTagsChild).toBeDefined();
  });

  it('uses PUBLIC_SITE_URL fallback for prerender origin', async () => {
    const { args } = makeLoadArgs('http://prerender.internal');
    const result = await load(args) as Record<string, unknown>;

    // ENV.PUBLIC_SITE_URL from .env.test, or hardcoded fallback
    expect(result.baseUrl).toBeTruthy();
    expect(result.baseUrl).not.toContain('prerender');
  });

  it('includes correct meta tag structure', async () => {
    const { args } = makeLoadArgs();
    const result = await load(args) as Record<string, unknown>;
    const meta = result.metaTagsChild as Record<string, unknown>;

    expect(meta.title).toBe('Home');
    expect((meta.openGraph as Record<string, unknown>)?.type).toBe('website');
    expect((meta.twitter as Record<string, unknown>)?.card).toBe('summary_large_image');
  });
});
