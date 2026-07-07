# 014 — Home page: use buildPageMetaTags instead of inline meta object

## What to build

The home page's `+page.server.ts` builds its meta tag object by hand (~35 lines), bypassing the `buildPageMetaTags` module that every other route uses correctly. It also contains a latent bug: the Twitter card and OpenGraph images receive different `content` strings, so social previews are inconsistent.

Replace the hand-rolled meta object with a `buildPageMetaTags(…)` call, aligning the home page with the rest of the site. If anything the home page needs can't be expressed by `buildPageMetaTags`, extend the function rather than bypassing it.

## Acceptance criteria

- [x] `src/routes/+page.server.ts` uses `buildPageMetaTags` instead of an inline meta object
- [x] Twitter and OpenGraph images receive consistent `content` strings
- [x] `pnpm check` passes with no type errors
- [x] Existing tests pass

## Blocked by

None — can start immediately
