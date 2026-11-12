/** How long articles stay cached, in seconds (12 hours): the Redis TTL and the page max-age. */
export const ARTICLES_CACHE_TTL_SECONDS = 43200;

/** Cache-control header for pages showing articles when every articles result is cacheable. */
export const ARTICLES_PAGE_MAX_AGE = `max-age=${ARTICLES_CACHE_TTL_SECONDS}`;

/** Cache-control header for responses that must not be cached. */
export const NO_CACHE = 'no-cache';
