import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './+server.js';

function report(body: string) {
  const request = new Request('http://localhost/api/csp-report', {
    method: 'POST',
    headers: { 'content-type': 'application/csp-report' },
    body,
  });
  return POST({ request } as unknown as Parameters<typeof POST>[0]);
}

const violation = {
  'csp-report': {
    'document-uri': 'https://bradleyshellnut.com/articles/2?ref=feed',
    'effective-directive': 'img-src',
    'violated-directive': 'img-src',
    'blocked-uri': 'https://f9.bcbits.com/img/a1.jpg',
    disposition: 'report',
  },
};

let warn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('POST /api/csp-report', () => {
  it('logs the directive, blocked URI and page path, and answers 204', async () => {
    const response = await report(JSON.stringify(violation));

    expect(response.status).toBe(204);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0].join(' ')).toBe('[csp] img-src blocked https://f9.bcbits.com/img/a1.jpg on /articles/2');
  });

  it('falls back to violated-directive when effective-directive is missing', async () => {
    const { 'effective-directive': _, ...rest } = violation['csp-report'];

    await report(JSON.stringify({ 'csp-report': { ...rest, 'violated-directive': 'script-src-elem' } }));

    expect(warn.mock.calls[0].join(' ')).toContain('script-src-elem blocked');
  });

  it('truncates long values so a report cannot flood the logs', async () => {
    const long = `https://evil.test/${'a'.repeat(1000)}`;

    await report(JSON.stringify({ 'csp-report': { ...violation['csp-report'], 'blocked-uri': long } }));

    expect(warn.mock.calls[0].join(' ').length).toBeLessThan(400);
  });

  it('strips newlines and control characters so a report cannot forge log lines', async () => {
    const forged = 'https://evil.test/x\n[error] database password reset\r\u001b[31mred\u0007';

    await report(
      JSON.stringify({
        'csp-report': { ...violation['csp-report'], 'blocked-uri': forged, 'effective-directive': 'img-src\nfake' },
      }),
    );

    const line = warn.mock.calls[0].join(' ');
    expect(line).not.toMatch(/\p{Cc}/u);
    expect(line).toBe('[csp] img-src fake blocked https://evil.test/x [error] database password reset [31mred on /articles/2');
  });

  for (const [name, body] of [
    ['malformed JSON', '{not json'],
    ['a body without a csp-report', JSON.stringify({ hello: 'world' })],
    ['an oversized body', JSON.stringify({ 'csp-report': { ...violation['csp-report'], pad: 'x'.repeat(20_000) } })],
  ]) {
    it(`ignores ${name} without logging and still answers 204`, async () => {
      const response = await report(body);

      expect(response.status).toBe(204);
      expect(warn).not.toHaveBeenCalled();
    });
  }
});
