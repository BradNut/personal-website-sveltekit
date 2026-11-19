import { createHash } from 'node:crypto';
import { expect, type Page, test } from '@playwright/test';

const POLICY_HEADER = 'content-security-policy-report-only';

/** Pages with no per-request data, which should render identically on every request. */
const DETERMINISTIC_PAGES = ['/about', '/portfolio', '/uses', '/privacy'];
const ALL_PAGES = ['/', '/articles/1', ...DETERMINISTIC_PAGES];

/** Records every Content Security Policy violation the page reports, from the first script onward. */
async function trackCspViolations(page: Page) {
  const violations: string[] = [];
  page.on('console', (message) => {
    if (/content security policy/i.test(message.text())) violations.push(message.text());
  });
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      console.error(`Content Security Policy violation: ${event.violatedDirective} ${event.blockedURI}`);
    });
  });
  return violations;
}

const sha256 = (content: string) => createHash('sha256').update(content).digest('base64');

test.describe('Content Security Policy', () => {
  for (const path of ALL_PAGES) {
    test(`${path} loads with no violations`, async ({ page }) => {
      const violations = await trackCspViolations(page);

      await page.goto(path, { waitUntil: 'networkidle' });

      expect(violations).toEqual([]);
    });

    test(`${path} is served the report-only policy, which allows every inline script by hash`, async ({ request }) => {
      const response = await request.get(path);
      const policy = response.headers()[POLICY_HEADER] ?? '';
      const html = await response.text();
      const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script[^>]*>/gi)].filter(([, , body]) => body.trim());

      expect(policy).toContain("default-src 'self'");
      expect(policy).toContain('report-uri /api/csp-report');
      expect(policy).not.toMatch(/script-src[^;]*'unsafe-inline'/);
      expect(policy).not.toContain("'nonce-");
      expect(inlineScripts.length).toBeGreaterThan(0);
      for (const [, attributes, body] of inlineScripts) {
        expect(attributes).not.toMatch(/nonce=/i);
        expect(policy, `inline script not allowed by hash: ${body.slice(0, 80)}`).toContain(`'sha256-${sha256(body)}'`);
      }
    });
  }

  for (const path of DETERMINISTIC_PAGES) {
    test(`${path} renders identically on every request, apart from the Bits UI counter id`, async ({ request }) => {
      const [first, second] = await Promise.all([request.get(path), request.get(path)].map(async (r) => (await r).text()));

      // Bits UI's counter id is the one known difference (runbook: Content Security Policy)
      const withoutBitsCounter = (html: string) => html.replace(/id="bits-\d+"/g, 'id="bits-n"');
      expect(withoutBitsCounter(second)).toBe(withoutBitsCounter(first));
    });
  }

  test('error pages are served the report-only policy', async ({ request }) => {
    const response = await request.get('/this-page-does-not-exist');

    expect(response.status()).toBe(404);
    expect(response.headers()[POLICY_HEADER]).toContain("default-src 'self'");
  });
});
