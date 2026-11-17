import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/env', () => ({
  dev: false,
}));

import { handleProbeRequest } from './probe-request';

type HandleEvent = Parameters<typeof handleProbeRequest>[0]['event'];

/** True when the handler answers the path itself instead of resolving the route. */
async function isProbeRequest(pathname: string): Promise<boolean> {
  const resolve = vi.fn(async () => new Response('resolved'));
  await handleProbeRequest({ event: { url: new URL(pathname, 'https://example.com') } as HandleEvent, resolve });
  return resolve.mock.calls.length === 0;
}

describe('Probe Request matching', () => {
  it('flags root-level PHP probes', async () => {
    expect(await isProbeRequest('/index.php')).toBe(true);
    expect(await isProbeRequest('/xmlrpc.php')).toBe(true);
  });

  it('flags WordPress probes', async () => {
    expect(await isProbeRequest('/wp-admin/setup-config.php')).toBe(true);
    expect(await isProbeRequest('/wp-login.php')).toBe(true);
    expect(await isProbeRequest('/wp-content/plugins/foo/readme.txt')).toBe(true);
  });

  it('flags sensitive-file probes', async () => {
    expect(await isProbeRequest('/.env')).toBe(true);
    expect(await isProbeRequest('/.git/config')).toBe(true);
    expect(await isProbeRequest('/.git/HEAD')).toBe(true);
  });

  it('flags CGI probes', async () => {
    expect(await isProbeRequest('/cgi-bin/test.cgi')).toBe(true);
  });

  it('does not flag ordinary typo paths', async () => {
    expect(await isProbeRequest('/abuot')).toBe(false);
    expect(await isProbeRequest('/projects/old-slug')).toBe(false);
  });

  it('does not flag normal application routes', async () => {
    expect(await isProbeRequest('/')).toBe(false);
    expect(await isProbeRequest('/about')).toBe(false);
  });
});

describe('handleProbeRequest', () => {
  it('short-circuits known Probe Requests with a plain generic 404 and skips route resolution', async () => {
    const resolve = vi.fn();

    const response = (await handleProbeRequest({
      event: { url: new URL('https://example.com/wp-login.php') } as HandleEvent,
      resolve,
    })) as Response;

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(404);
    expect(resolve).not.toHaveBeenCalled();
  });

  it('passes ordinary Route Misses through to route resolution', async () => {
    const resolve = vi.fn(async () => new Response('normal 404', { status: 404 }));

    const response = await handleProbeRequest({
      event: {
        url: new URL('https://example.com/some-typo-page'),
      } as HandleEvent,
      resolve,
    });

    expect(resolve).toHaveBeenCalledOnce();
    expect(response).toBeInstanceOf(Response);
  });
});
