import { ARTICLES_PAGE_MAX_AGE, NO_CACHE } from '$lib/constants/cache-control';

/** The cache-control header for a page built from one or more articles results: 12 hours unless any result says not to cache it. */
export function articlesPageCacheControl(...resultCacheControls: Array<string | undefined>): string {
  return resultCacheControls.some((cacheControl) => cacheControl?.includes(NO_CACHE)) ? NO_CACHE : ARTICLES_PAGE_MAX_AGE;
}
