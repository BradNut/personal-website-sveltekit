import { beforeEach, describe, expect, it, vi } from 'vitest';

const fetchArticlesApiMock = vi.fn();
vi.mock('$lib/services/articlesApi', () => ({
  fetchArticlesApi: (...args: unknown[]) => fetchArticlesApiMock(...args),
}));

vi.mock('varlock/env', () => ({
  ENV: { PAGE_SIZE: 10 },
}));

import { GET } from './+server.js';

function makeRequestEvent(params: Record<string, string> = {}) {
  const url = new URL('http://localhost/api/articles');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const capturedHeaders: Record<string, string> = {};
  const event = {
    url,
    setHeaders: (h: Record<string, string>) => Object.assign(capturedHeaders, h),
  } as unknown as Parameters<typeof GET>[0];
  return { event, capturedHeaders };
}

beforeEach(() => {
  fetchArticlesApiMock.mockReset();
});

describe('GET /api/articles', () => {
  it('returns articles with cache-control from response', async () => {
    fetchArticlesApiMock.mockResolvedValueOnce({
      articles: [{ title: 'Test' }],
      currentPage: 1,
      totalPages: 1,
      limit: 10,
      totalArticles: 1,
      cacheControl: 'max-age=120',
    });

    const { event, capturedHeaders } = makeRequestEvent({ page: '1', limit: '10' });
    const response = await GET(event);
    const body = await response?.json();

    expect(body.articles).toHaveLength(1);
    expect(capturedHeaders['cache-control']).toBe('max-age=120');
  });

  it('sets max-age=43200 when cacheControl is no-cache', async () => {
    fetchArticlesApiMock.mockResolvedValueOnce({
      articles: [{ title: 'Test' }],
      currentPage: 1,
      totalPages: 1,
      limit: 10,
      totalArticles: 1,
      cacheControl: 'no-cache',
    });

    const { event, capturedHeaders } = makeRequestEvent({ page: '1' });
    const response = await GET(event);
    const body = await response?.json();

    expect(body.articles).toHaveLength(1);
    expect(capturedHeaders['cache-control']).toBe('max-age=43200');
  });

  it('clamps limit to PAGE_SIZE when over 30', async () => {
    fetchArticlesApiMock.mockResolvedValueOnce({
      articles: [],
      currentPage: 1,
      totalPages: 0,
      limit: 10,
      totalArticles: 0,
      cacheControl: 'no-cache',
    });

    const { event } = makeRequestEvent({ page: '1', limit: '999' });
    await GET(event);

    expect(fetchArticlesApiMock).toHaveBeenCalledWith('get', 'fetchArticles', {
      page: '1',
      limit: '10',
    });
  });

  it('returns fallback JSON when fetchArticlesApi throws', async () => {
    fetchArticlesApiMock.mockRejectedValueOnce(new Error('upstream down'));

    const { event } = makeRequestEvent({ page: '2' });
    const response = await GET(event);
    const body = await response?.json();

    expect(body.articles).toEqual([]);
    expect(body.currentPage).toBe(2);
  });

  it('defaults page to 1 when not provided', async () => {
    fetchArticlesApiMock.mockResolvedValueOnce({
      articles: [],
      currentPage: 1,
      totalPages: 0,
      limit: 10,
      totalArticles: 0,
      cacheControl: 'no-cache',
    });

    const { event } = makeRequestEvent();
    await GET(event);

    expect(fetchArticlesApiMock).toHaveBeenCalledWith('get', 'fetchArticles', {
      page: '1',
      limit: '10',
    });
  });
});
