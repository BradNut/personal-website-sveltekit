const PROBE_DENYLIST_EXACT = new Set(['/.env', '/.git/config', '/.git/HEAD', '/xmlrpc.php', '/wp-login.php']);

const PROBE_DENYLIST_PREFIXES = ['/wp-admin/', '/wp-content/', '/wp-includes/', '/cgi-bin/'];

const ROOT_LEVEL_PHP_PROBE = /^\/[^/]+\.php$/;

export function isProbeRequest(pathname: string): boolean {
  if (PROBE_DENYLIST_EXACT.has(pathname)) {
    return true;
  }

  if (PROBE_DENYLIST_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  return ROOT_LEVEL_PHP_PROBE.test(pathname);
}
