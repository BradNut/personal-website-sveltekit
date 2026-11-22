import { entries, entriesTagged } from './entries.mjs';

/** Articles per page in e2e runs; the Playwright web server pins `PAGE_SIZE` to this. */
export const ARTICLES_PER_PAGE = 10;

/** The tag the site asks Wallabag for (`tags=programming` in `fetchArticles`). */
const REQUESTED_TAG = 'programming';

const returnedEntries = entriesTagged(REQUESTED_TAG);
const port = 4183;

/** The fake Wallabag the e2e app server reads articles from (see `server.mjs` and `entries.json`). */
export const FAKE_WALLABAG = {
  port,
  url: `http://127.0.0.1:${port}`,
  /** Pages of entries the fake returns for the requested tag at `ARTICLES_PER_PAGE`. */
  publishedPages: Math.ceil(returnedEntries.length / ARTICLES_PER_PAGE),
  /** Titles of entries in `entries.json` the fake does not return for the requested tag; none may be published. */
  unpublishedTitles: entries.filter((entry) => !returnedEntries.includes(entry)).map((entry) => entry.title),
} as const;
