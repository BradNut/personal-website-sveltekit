import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./$types', () => ({}));

const fetchArticlesMock = vi.fn();
vi.mock('$lib/services/articlesApi', () => ({
  fetchArticles: (...args: unknown[]) => fetchArticlesMock(...args),
}));

import { load } from './+layout.server.js';

function makeLoadArgs() {
  const url = new URL('https://bradleyshellnut.com/articles');
  return {
    args: {
      url,
      request: new Request(url),
      route: { id: '/articles' },
      params: {},
      isDataRequest: false,
      isSubRequest: false,
    } as unknown as Parameters<typeof load>[0],
  };
}

beforeEach(() => {
  fetchArticlesMock.mockReset();
});

describe('load (articles layout)', () => {
  it('returns common metadata from fetchArticles for page 1', async () => {
    fetchArticlesMock.mockResolvedValueOnce({
      articles: [],
      currentPage: 1,
      totalPages: 4,
      limit: 10,
      totalArticles: 37,
      cacheControl: 'max-age=120',
    });

    const { args } = makeLoadArgs();
    const result = (await load(args)) as Record<string, unknown>;

    expect(fetchArticlesMock).toHaveBeenCalledWith({ page: '1' });
    expect(result.totalArticles).toBe(37);
    expect(result.totalPages).toBe(4);
    expect(result.limit).toBe(10);
    expect(result.cacheControl).toBe('max-age=120');
  });

  it('propagates no-cache fallback metadata', async () => {
    fetchArticlesMock.mockResolvedValueOnce({
      articles: [],
      currentPage: 1,
      totalPages: 0,
      limit: 10,
      totalArticles: 0,
      cacheControl: 'no-cache',
    });

    const { args } = makeLoadArgs();
    const result = (await load(args)) as Record<string, unknown>;

    expect(result.totalPages).toBe(0);
    expect(result.cacheControl).toBe('no-cache');
  });
});
