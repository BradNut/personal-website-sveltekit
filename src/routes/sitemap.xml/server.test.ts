import { describe, expect, it, vi } from 'vitest';

import { GET } from './+server.js';

function makeEvent(totalPages = 2) {
  const capturedHeaders: Record<string, string> = {};
  const fetchMock = vi.fn().mockResolvedValue({
    json: async () => ({ totalPages }),
  });

  return {
    event: {
      fetch: fetchMock,
      setHeaders: (h: Record<string, string>) => Object.assign(capturedHeaders, h),
    } as unknown as Parameters<typeof GET>[0],
    capturedHeaders,
    fetchMock,
  };
}

describe('GET /sitemap.xml', () => {
  it('builds sitemap URLs from the configured public site URL', async () => {
    const { capturedHeaders, event, fetchMock } = makeEvent();

    const response = await GET(event);
    const xml = await response.text();

    expect(fetchMock).toHaveBeenCalledWith('/api/articles');
    expect(capturedHeaders['Content-Type']).toBe('application/xml');
    expect(xml).toContain('<loc>https://bradleyshellnut.com/</loc>');
    expect(xml).toContain('<loc>https://bradleyshellnut.com/about</loc>');
    expect(xml).toContain('<loc>https://bradleyshellnut.com/articles/1</loc>');
    expect(xml).toContain('<loc>https://bradleyshellnut.com/articles/2</loc>');
    expect(xml).toContain('<loc>https://bradleyshellnut.com/uses</loc>');
  });
});
