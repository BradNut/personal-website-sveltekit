import { ENV } from 'varlock/env';

const fallbackSiteUrl = 'https://bradleyshellnut.com';

type SiteUrlOptions = {
  publicSiteUrl?: string;
};

type OgEndpointParams = {
  header?: string;
  page?: string;
  content?: string;
};

function ensureTrailingSlash(value: string) {
  return new URL(value).href;
}

export function resolveSiteUrl(url: URL, options: SiteUrlOptions = {}) {
  const publicSiteUrl = options.publicSiteUrl || ENV.PUBLIC_SITE_URL || fallbackSiteUrl;

  if (url.origin.includes('prerender')) {
    return ensureTrailingSlash(publicSiteUrl);
  }

  return new URL(url.origin).href;
}

export function resolveCurrentPageUrl(url: URL, options: SiteUrlOptions = {}) {
  return new URL(url.pathname, resolveSiteUrl(url, options)).href;
}

export function resolveAssetUrl(url: URL, assetPath: string, options: SiteUrlOptions = {}) {
  return new URL(assetPath, resolveSiteUrl(url, options)).href;
}

export function resolveOgEndpointUrl(url: URL, params: OgEndpointParams, options: SiteUrlOptions = {}) {
  const ogUrl = new URL('og', resolveSiteUrl(url, options));

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      ogUrl.searchParams.set(key, value);
    }
  }

  return ogUrl.href;
}

export function resolveSitemapUrl(pathname: string, options: SiteUrlOptions = {}) {
  const publicSiteUrl = options.publicSiteUrl || ENV.PUBLIC_SITE_URL || fallbackSiteUrl;

  return new URL(pathname, ensureTrailingSlash(publicSiteUrl)).href;
}
