import { expect, type Page, test } from '@playwright/test';

const POLICY_HEADER = 'content-security-policy-report-only';

/** Pages rendered per request, so SvelteKit sends them the report-only policy with a fresh nonce. */
const DYNAMIC_PAGES = ['/', '/articles/1'];
const VISITED_PAGES = [...DYNAMIC_PAGES, '/portfolio', '/uses', '/about'];

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

test.describe('Content Security Policy', () => {
  for (const path of VISITED_PAGES) {
    test(`${path} loads with no violations`, async ({ page }) => {
      const violations = await trackCspViolations(page);

      await page.goto(path, { waitUntil: 'networkidle' });

      expect(violations).toEqual([]);
    });
  }

  for (const path of DYNAMIC_PAGES) {
    test(`${path} is served the report-only policy, and every inline script carries its nonce`, async ({ request }) => {
      const response = await request.get(path);
      const policy = response.headers()[POLICY_HEADER] ?? '';
      const html = await response.text();
      const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter(([, , body]) => body.trim());

      expect(policy).toContain("default-src 'self'");
      expect(policy).toContain('report-uri /api/csp-report');
      expect(policy).not.toMatch(/script-src[^;]*'unsafe-inline'/);
      expect(inlineScripts.length).toBeGreaterThan(0);
      for (const [, attributes] of inlineScripts) {
        const nonce = /nonce="([^"]+)"/.exec(attributes)?.[1];
        expect(nonce, `inline script without a nonce: ${attributes}`).toBeTruthy();
        expect(policy).toContain(`'nonce-${nonce}'`);
      }
    });
  }

  test('error pages are served the report-only policy', async ({ request }) => {
    const response = await request.get('/this-page-does-not-exist');

    expect(response.status()).toBe(404);
    expect(response.headers()[POLICY_HEADER]).toContain("default-src 'self'");
  });
});
