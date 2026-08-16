import { describe, expect, it } from 'vitest';

import { isProbeRequest } from './probeRequest';

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
