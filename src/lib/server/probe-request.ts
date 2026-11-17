import type { Handle } from '@sveltejs/kit/hooks';
import { StatusCodes } from '#lib/constants/status-codes.ts';
import { dev } from '$app/env';

const PROBE_DENYLIST_EXACT = new Set(['/.env', '/.git/config', '/.git/HEAD', '/xmlrpc.php', '/wp-login.php']);

const PROBE_DENYLIST_PREFIXES = ['/wp-admin/', '/wp-content/', '/wp-includes/', '/cgi-bin/'];

const ROOT_LEVEL_PHP_PROBE = /^\/[^/]+\.php$/;

function isProbeRequest(pathname: string): boolean {
  if (PROBE_DENYLIST_EXACT.has(pathname)) {
    return true;
  }

  if (PROBE_DENYLIST_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  return ROOT_LEVEL_PHP_PROBE.test(pathname);
}

/** First in the `handle` sequence: answers Probe Requests with a plain 404 before route resolution or Sentry. */
export const handleProbeRequest: Handle = async ({ event, resolve }) => {
  if (!isProbeRequest(event.url.pathname)) {
    return resolve(event);
  }

  if (dev) {
    console.debug(`Suppressed Probe Request: ${event.url.pathname}`);
  }

  return new Response('Not Found', { status: StatusCodes.NOT_FOUND });
};
