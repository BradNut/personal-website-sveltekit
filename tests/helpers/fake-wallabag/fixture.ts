/** Articles per page in e2e runs; the Playwright web server pins `PAGE_SIZE` to this. */
export const ARTICLES_PER_PAGE = 10;

/** The fake Wallabag the e2e app server reads articles from (see `server.mjs` and `entries.json`). */
export const FAKE_WALLABAG = {
  port: 4183,
  url: 'http://127.0.0.1:4183',
  /** `entries.json` holds this many pages of entries with an Allowed Tag at `ARTICLES_PER_PAGE`. */
  publishedPages: 3,
  /** Title of the one entry in `entries.json` with no Allowed Tag; it must never be published. */
  untaggedTitle: 'Fake entry without an Allowed Tag',
} as const;
