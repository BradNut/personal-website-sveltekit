import type { Config } from '@sveltejs/kit/vite';

/** Kit 3 doesn't export its directives type, so take it from the `csp` option it belongs to. */
type CspDirectives = NonNullable<NonNullable<Config['csp']>['reportOnly']>;
/** A configured service's origin, in the `scheme://host.domain` form Kit's host-source type accepts. */
type Origin = `${string}://${string}.${string}`;

/**
 * Content Security Policy directives, consumed by `vite.config.ts` (`sveltekit({ csp })`).
 * Keywords are written bare (`self`, not `'self'`); SvelteKit 3 quotes them in the header.
 * SvelteKit's `csp.mode: 'auto'` adds a per-request nonce (or, on prerendered pages, a hash)
 * for its own inline bootstrap script, so `script-src` never needs `'unsafe-inline'`.
 *
 * Why each external origin is allowed (keep in sync with what the site really loads):
 * - **Umami** (`PUBLIC_UMAMI_URL`): the analytics `<script>` in `lib/components/analytics`
 *   loads from this origin (`script-src`) and posts page views back to it (`connect-src`).
 * - **Bugsink** (`PUBLIC_SENTRY_URL`): the browser Sentry SDK in `hooks.client.ts` sends
 *   errors to the DSN's origin (`connect-src`). Only the origin is used, never the DSN key.
 * - **Bandcamp** (`https://f4.bcbits.com`): album artwork scraped from the Bandcamp collection
 *   is hot-linked from Bandcamp's image CDN (`img-src`). Every artwork URL served in Nov 2026
 *   used this host; if Bandcamp moves to another `*.bcbits.com` shard, reports will show it.
 * - **Spotlight** (`http://localhost:8969`): Sentry's local sidecar, which the SDK talks to in
 *   development only (`spotlight: dev`), so it is added to `connect-src` only in development.
 *
 * `img-src` allows `data:` because Vite inlines small imported images (under 4 KB) as data URIs;
 * the logo's bee, hazelnut and shell SVGs (`lib/components/logo`) render that way on every page.
 *
 * Style is `'self' 'unsafe-inline'`: components are compiled with `css: 'injected'` (styles are
 * inserted as `<style>` elements at runtime), and inline `style` attributes (`app.html`,
 * `style:` directives, transitions) can't carry a nonce. Scripts stay strict.
 *
 * Wallabag article images are not allowed: the articles list renders no preview images, and
 * the Wallabag hostname must not be published (it would ship in this header).
 *
 * Never put secret values here: the policy is sent to every browser as a response header.
 */

/** Bandcamp's image CDN host, which serves the scraped album artwork. */
export const BANDCAMP_IMAGE_ORIGIN = 'https://f4.bcbits.com';

/** Sentry's Spotlight sidecar; the SDK only connects to it in development. */
export const SPOTLIGHT_ORIGIN = 'http://localhost:8969' as const;

/** Where browsers POST violation reports; see `routes/api/csp-report`. */
export const CSP_REPORT_PATH = '/api/csp-report';

export type CspOptions = {
  /** `PUBLIC_UMAMI_URL`: the Umami analytics script URL. */
  umamiUrl?: string;
  /** `PUBLIC_SENTRY_URL`: the browser Sentry DSN. */
  sentryDsn?: string;
  /** Adds the local Spotlight sidecar to `connect-src`. */
  development?: boolean;
};

/** The origin of a configured URL, or nothing when it is unset or not a URL (e.g. empty locally). */
function originOf(url: string | undefined): Origin[] {
  if (!url) return [];
  try {
    // A parsed URL's origin is always `scheme://host[:port]`
    return [new URL(url).origin as Origin];
  } catch {
    return [];
  }
}

export function createCspDirectives({ umamiUrl, sentryDsn, development = false }: CspOptions = {}): CspDirectives {
  const umami = originOf(umamiUrl);
  const sentry = originOf(sentryDsn);

  return {
    'default-src': ['self'],
    'base-uri': ['self'],
    'object-src': ['none'],
    'form-action': ['self'],
    'frame-ancestors': ['self'],
    'script-src': ['self', ...umami],
    'connect-src': ['self', ...umami, ...sentry, ...(development ? [SPOTLIGHT_ORIGIN] : [])],
    'img-src': ['self', 'data:', BANDCAMP_IMAGE_ORIGIN],
    'style-src': ['self', 'unsafe-inline'],
    'report-uri': [CSP_REPORT_PATH],
  };
}
