import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./$types', () => ({}));

vi.mock('varlock/env', () => ({
  initVarlockEnv: vi.fn(),
  ENV: {
    PUBLIC_SITE_URL: 'https://bradleyshellnut.com',
  },
}));

const fetchArticlesMock = vi.fn();
vi.mock('$lib/services/articlesApi', () => ({
  fetchArticles: (...args: unknown[]) => fetchArticlesMock(...args),
}));

import { load } from './+page.server.js';

function makeLoadArgs(page = '2', cacheControl = 'max-age=120') {
  const capturedHeaders: Record<string, string> = {};
  const url = new URL(`https://bradleyshellnut.com/articles/${page}`);
  return {
    args: {
      params: { page },
      setHeaders: (h: Record<string, string>) => Object.assign(capturedHeaders, h),
      url,
      parent: async () => ({ cacheControl }),
      request: new Request(url),
      route: { id: '/articles/[page]' },
      isDataRequest: false,
      isSubRequest: false,
    } as unknown as Parameters<typeof load>[0],
    capturedHeaders,
  };
}

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

beforeEach(() => {
  fetchArticlesMock.mockReset();
});

describe('load (articles [page])', () => {
  it('fetches the requested page directly and returns articles', async () => {
    fetchArticlesMock.mockResolvedValueOnce({
      articles: [mockArticle],
      currentPage: 2,
      totalPages: 4,
      limit: 10,
      totalArticles: 37,
      cacheControl: 'max-age=120',
    });

    const { args, capturedHeaders } = makeLoadArgs('2');
    const result = (await load(args)) as Record<string, unknown>;

    expect(fetchArticlesMock).toHaveBeenCalledWith({ page: '2' });
    expect(result.currentPage).toBe(2);
    const articles = result.articles as Array<Record<string, unknown>>;
    expect(articles[0].url).toBeInstanceOf(URL);
    expect(articles[0].created_at).toBeInstanceOf(Date);
    expect(capturedHeaders['cache-control']).toBe('max-age=43200');
    expect(result.metaTagsChild).toBeDefined();
  });

  it('honors no-cache from parent cacheControl', async () => {
    fetchArticlesMock.mockResolvedValueOnce({
      articles: [],
      currentPage: 1,
      totalPages: 0,
      limit: 10,
      totalArticles: 0,
      cacheControl: 'no-cache',
    });

    const { args, capturedHeaders } = makeLoadArgs('1', 'no-cache');
    await load(args);

    expect(capturedHeaders['cache-control']).toBe('no-cache');
  });
});
