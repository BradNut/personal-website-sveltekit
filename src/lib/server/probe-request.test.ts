import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/env', () => ({
  dev: false,
}));

import { handleProbeRequest, isProbeRequest } from './probe-request';

describe('isProbeRequest', () => {
  it('flags root-level PHP probes', () => {
    expect(isProbeRequest('/index.php')).toBe(true);
    expect(isProbeRequest('/xmlrpc.php')).toBe(true);
  });

  it('flags WordPress probes', () => {
    expect(isProbeRequest('/wp-admin/setup-config.php')).toBe(true);
    expect(isProbeRequest('/wp-login.php')).toBe(true);
    expect(isProbeRequest('/wp-content/plugins/foo/readme.txt')).toBe(true);
  });

  it('flags sensitive-file probes', () => {
    expect(isProbeRequest('/.env')).toBe(true);
    expect(isProbeRequest('/.git/config')).toBe(true);
    expect(isProbeRequest('/.git/HEAD')).toBe(true);
  });

  it('flags CGI probes', () => {
    expect(isProbeRequest('/cgi-bin/test.cgi')).toBe(true);
  });

  it('does not flag ordinary typo paths', () => {
    expect(isProbeRequest('/abuot')).toBe(false);
    expect(isProbeRequest('/projects/old-slug')).toBe(false);
  });

  it('does not flag normal application routes', () => {
    expect(isProbeRequest('/')).toBe(false);
    expect(isProbeRequest('/about')).toBe(false);
  });
});

describe('handleProbeRequest', () => {
  it('short-circuits known Probe Requests with a plain generic 404 and skips route resolution', async () => {
    const resolve = vi.fn();

    const response = (await handleProbeRequest({
      event: { url: new URL('https://example.com/wp-login.php') } as Parameters<typeof handleProbeRequest>[0]['event'],
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
      } as Parameters<typeof handleProbeRequest>[0]['event'],
      resolve,
    });

    expect(resolve).toHaveBeenCalledOnce();
    expect(response).toBeInstanceOf(Response);
  });
});
