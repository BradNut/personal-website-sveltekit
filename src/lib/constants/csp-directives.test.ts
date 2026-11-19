import { describe, expect, it } from 'vitest';
import { BANDCAMP_IMAGE_ORIGIN, CSP_REPORT_PATH, createCspDirectives, SPOTLIGHT_ORIGIN } from './csp-directives.ts';

const umamiUrl = 'https://umami.test/script.js';
const sentryDsn = 'https://publickey@bugsink.test/1';

describe('createCspDirectives', () => {
  it('sets the baseline directives', () => {
    const policy = createCspDirectives();

    expect(policy['default-src']).toEqual(['self']);
    expect(policy['object-src']).toEqual(['none']);
    expect(policy['base-uri']).toEqual(['self']);
    expect(policy['form-action']).toEqual(['self']);
    expect(policy['frame-ancestors']).toEqual(['self']);
  });

  it('allows the Umami script and its collection endpoint by origin', () => {
    const policy = createCspDirectives({ umamiUrl });

    expect(policy['script-src']).toEqual(['self', 'https://umami.test']);
    expect(policy['connect-src']).toContain('https://umami.test');
  });

  it('allows the Bugsink origin for browser errors without publishing the DSN key', () => {
    const policy = createCspDirectives({ sentryDsn });

    expect(policy['connect-src']).toContain('https://bugsink.test');
    expect(JSON.stringify(policy)).not.toContain('publickey');
  });

  it('allows Bandcamp album artwork and Vite-inlined data URI images', () => {
    expect(createCspDirectives()['img-src']).toEqual(['self', 'data:', BANDCAMP_IMAGE_ORIGIN]);
  });

  it('allows the Spotlight sidecar only in development', () => {
    expect(createCspDirectives({ development: true })['connect-src']).toContain(SPOTLIGHT_ORIGIN);
    expect(JSON.stringify(createCspDirectives())).not.toContain(SPOTLIGHT_ORIGIN);
  });

  for (const value of [undefined, '', 'not a url']) {
    it(`skips an unset or invalid origin (${JSON.stringify(value)})`, () => {
      const policy = createCspDirectives({ umamiUrl: value, sentryDsn: value });

      expect(policy['script-src']).toEqual(['self']);
      expect(policy['connect-src']).toEqual(['self']);
    });
  }

  it('never allows inline or eval scripts', () => {
    const policy = createCspDirectives({ umamiUrl, sentryDsn, development: true });

    expect(JSON.stringify(policy['script-src'])).not.toMatch(/unsafe-|\*/);
  });

  it('sends violation reports to the report endpoint', () => {
    expect(createCspDirectives()['report-uri']).toEqual([CSP_REPORT_PATH]);
  });
});
