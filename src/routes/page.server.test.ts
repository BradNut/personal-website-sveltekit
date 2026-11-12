import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./$types', () => ({}));

const mockArticle = {
  title: 'Article 1',
  url: new URL('https://example.com/a1'),
  domain_name: 'example.com',
  hashed_url: 'hash1',
  reading_time: 5,
  preview_picture: '',
  tags: [],
  created_at: new Date('2024-01-01T00:00:00.000Z'),
  updated_at: new Date('2024-01-02T00:00:00.000Z'),
  archived_at: null,
};
const mockArticles = { articles: [mockArticle], currentPage: 1, totalPages: 1, limit: 3, totalArticles: 1, cacheControl: 'max-age=120' };
const emptyNoCacheArticles = { articles: [], currentPage: 1, totalPages: 0, limit: 3, totalArticles: 0, cacheControl: 'no-cache' };
const fetchArticlesMock = vi.fn();
vi.mock('$lib/services/articlesApi', () => ({
  fetchArticles: (...args: unknown[]) => fetchArticlesMock(...args),
}));

import { load } from './+page.server.js';

const mockAlbums = [{ title: 'Album 1', url: 'https://bandcamp.com/1', artwork: '', artist: 'A' }];

function makeLoadArgs(originUrl = 'http://localhost') {
  const capturedHeaders: Record<string, string> = {};
  const fetchMock = vi
    .fn()
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
  vi.clearAllMocks();
  fetchArticlesMock.mockResolvedValue(mockArticles);
});

describe('load (root page)', () => {
  it('fetches albums and articles, sets cache headers', async () => {
    const { args, fetchMock, capturedHeaders } = makeLoadArgs();
    const result = (await load(args)) as Record<string, unknown>;

    expect(fetchMock).toHaveBeenCalledWith('/api/bandcamp/albums');
    expect(fetchArticlesMock).toHaveBeenCalledWith({ page: '1', limit: '3' });
    expect(capturedHeaders['cache-control']).toBe('max-age=43200');
    expect(result.albums).toEqual(mockAlbums);
    expect(result.articlesData).toEqual(mockArticles);
    expect(result.baseUrl).toBe('http://localhost/'); // NOSONAR - localhost test fixture, not production
    expect(result.metaTagsChild).toBeDefined();
  });

  it('sends no-cache when the articles result is marked no-cache', async () => {
    fetchArticlesMock.mockResolvedValueOnce(emptyNoCacheArticles);
    const { args, capturedHeaders } = makeLoadArgs();
    await load(args);

    expect(capturedHeaders['cache-control']).toBe('no-cache');
  });

  it('uses PUBLIC_SITE_URL fallback for prerender origin', async () => {
    const { args } = makeLoadArgs('http://prerender.internal'); // NOSONAR - internal test fixture
    const result = (await load(args)) as Record<string, unknown>;
    const meta = result.metaTagsChild as Record<string, unknown>;

    // ENV.PUBLIC_SITE_URL from .env.test, or hardcoded fallback
    expect(result.baseUrl).toBeTruthy();
    expect(result.baseUrl).not.toContain('prerender');
    expect(meta.url).not.toContain('prerender');
  });

  it('includes correct meta tag structure', async () => {
    const { args } = makeLoadArgs();
    const result = (await load(args)) as Record<string, unknown>;
    const meta = result.metaTagsChild as Record<string, unknown>;

    expect(meta.title).toBe('Home');
    expect((meta.openGraph as Record<string, unknown>)?.type).toBe('website');
    expect((meta.twitter as Record<string, unknown>)?.card).toBe('summary_large_image');
  });

  it('OG and Twitter images share the same URL', async () => {
    const { args } = makeLoadArgs();
    const result = (await load(args)) as Record<string, unknown>;
    const meta = result.metaTagsChild as Record<string, unknown>;

    const ogImage = ((meta.openGraph as Record<string, unknown>)?.images as Array<Record<string, unknown>>)?.[0]?.url;
    const twitterImage = (meta.twitter as Record<string, unknown>)?.image;

    expect(ogImage).toBeTruthy();
    expect(ogImage).toBe(twitterImage);
  });
});
