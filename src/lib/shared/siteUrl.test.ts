import { describe, expect, it } from 'vitest';

import { resolveAssetUrl, resolveCurrentPageUrl, resolveOgEndpointUrl, resolveSitemapUrl, resolveSiteUrl } from './siteUrl.js';

describe('site URL resolution', () => {
  it('uses configured public site URL for prerender origins', () => {
    const resolved = resolveSiteUrl(new URL('http://prerender.internal/articles'), {
      publicSiteUrl: 'https://bradleyshellnut.com',
    });

    expect(resolved).toBe('https://bradleyshellnut.com/');
  });

  it('uses localhost request origin outside prerender', () => {
    const resolved = resolveSiteUrl(new URL('http://localhost:5173/about'), {
      publicSiteUrl: 'https://bradleyshellnut.com',
    });

    expect(resolved).toBe('http://localhost:5173/');
  });

  it('resolves current page URLs against the request origin', () => {
    const resolved = resolveCurrentPageUrl(new URL('http://localhost:5173/articles/2'));

    expect(resolved).toBe('http://localhost:5173/articles/2');
  });

  it('resolves current page URLs against the public site URL for prerender origins', () => {
    const resolved = resolveCurrentPageUrl(new URL('http://prerender.internal/articles/2'), {
      publicSiteUrl: 'https://bradleyshellnut.com',
    });

    expect(resolved).toBe('https://bradleyshellnut.com/articles/2');
  });

  it('resolves asset and OG endpoint URLs against the public site URL', () => {
    const url = new URL('http://prerender.internal/about');
    const options = { publicSiteUrl: 'https://bradleyshellnut.com' };

    expect(resolveAssetUrl(url, 'b_shell_nut_favicon.png', options)).toBe(
      'https://bradleyshellnut.com/b_shell_nut_favicon.png',
    );
    expect(resolveOgEndpointUrl(url, { header: 'About | bradleyshellnut.com', page: 'About Bradley Shellnut' }, options))
      .toBe('https://bradleyshellnut.com/og?header=About+%7C+bradleyshellnut.com&page=About+Bradley+Shellnut');
  });

  it('resolves sitemap URLs against the configured public site URL', () => {
    const resolved = resolveSitemapUrl('/articles/2', {
      publicSiteUrl: 'https://bradleyshellnut.com',
    });

    expect(resolved).toBe('https://bradleyshellnut.com/articles/2');
  });
});
