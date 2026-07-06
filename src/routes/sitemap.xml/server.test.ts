import { describe, expect, it, vi } from 'vitest';

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

import { GET } from './+server.js';

const base = 'https://bradleyshellnut.com';

function makeEvent(totalPages = 2) {
  const capturedHeaders: Record<string, string> = {};
  fetchArticlesMock.mockResolvedValue({ totalPages });

  return {
    event: {
      setHeaders: (h: Record<string, string>) => Object.assign(capturedHeaders, h),
    } as unknown as Parameters<typeof GET>[0],
    capturedHeaders,
  };
}

describe('GET /sitemap.xml', () => {
  it('builds sitemap URLs from the configured public site URL', async () => {
    const { capturedHeaders, event } = makeEvent();

    const response = await GET(event);
    const xml = await response.text();

    expect(fetchArticlesMock).toHaveBeenCalledWith({});
    expect(capturedHeaders['Content-Type']).toBe('application/xml');
    expect(xml).toContain(`<loc>${base}/</loc>`);
    expect(xml).toContain(`<loc>${base}/about</loc>`);
    expect(xml).toContain(`<loc>${base}/articles/1</loc>`);
    expect(xml).toContain(`<loc>${base}/articles/2</loc>`);
    expect(xml).toContain(`<loc>${base}/uses</loc>`);
  });
});
