import { expect, type Page, test } from '@playwright/test';

const HEADER_NAV = 'nav[aria-label="header navigation"]';
const FOOTER_NAV = 'footer nav[aria-label="footer navigation"]';
const NAV_AREAS = [HEADER_NAV, FOOTER_NAV];

const HEADER_ROUTES = [
  { name: 'Home', url: /\/?$/ },
  { name: 'About', url: /\/about\/?$/ },
  { name: 'Portfolio', url: /\/portfolio\/?$/ },
  { name: 'Uses', url: /\/uses\/?$/ },
] as const;

const FOOTER_LINKS = [...HEADER_ROUTES.map((r) => r.name), 'Privacy', 'Favorite Articles'];

type LayoutNavOptions = {
  /** Route the tests start on, e.g. '/about'. */
  path: string;
  /** Header link that should carry the `active` class on this page. */
  activeLink: (typeof HEADER_ROUTES)[number]['name'];
  /** Header/footer link used for the hover-colour check. */
  hoverLink: string;
};

async function resolveCssColor(page: Page, value: string): Promise<string> {
  return page.evaluate((cssValue) => {
    const probe = document.createElement('div');
    probe.style.color = cssValue;
    document.body.appendChild(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, value);
}

async function clickFooterLink(page: Page, name: string) {
  const link = page.getByRole('navigation', { name: 'footer navigation' }).getByRole('link', { name, exact: true });
  await link.scrollIntoViewIfNeeded();
  await link.click();
}

/**
 * Registers the header/footer navigation tests shared by every top-level page.
 * Call inside a `test.describe` block.
 */
export function registerLayoutNavTests({ path, activeLink, hoverLink }: LayoutNavOptions) {
  test('header/footer links hover: color becomes shellYellow', async ({ page }) => {
    await page.goto(path);
    const shellYellow = await resolveCssColor(page, 'var(--shellYellow)');

    for (const area of NAV_AREAS) {
      const nav = page.locator(area);
      await expect(nav).toBeVisible();

      const link = nav.getByRole('link', { name: hoverLink, exact: true });
      await expect(link).toBeVisible();

      const before = await link.evaluate((el) => getComputedStyle(el).color);
      await link.hover();
      // Wait for color transition to complete (0.2s ease)
      await page.waitForTimeout(300);
      const after = await link.evaluate((el) => getComputedStyle(el).color);

      expect(after).toBe(shellYellow);
      expect(after).not.toBe(before);
    }
  });

  test(`current page (${activeLink}) link is active in header and footer`, async ({ page }) => {
    await page.goto(path);
    for (const area of NAV_AREAS) {
      const link = page.locator(area).getByRole('link', { name: activeLink, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveClass(/(^|\s)active(\s|$)/);
    }
  });

  test('header navigation shows expected links', async ({ page }) => {
    await page.goto(path);
    const headerNav = page.locator(HEADER_NAV);
    await expect(headerNav).toBeVisible();
    for (const { name } of HEADER_ROUTES) {
      await expect(headerNav.getByRole('link', { name, exact: true })).toBeVisible();
    }
  });

  test(`header navigation links go to correct routes (from ${path})`, async ({ page }) => {
    await page.goto(path);
    const headerNav = page.locator(HEADER_NAV);

    // Visit every other page, then return to the starting page.
    const others = HEADER_ROUTES.filter((r) => r.name !== activeLink);
    const start = HEADER_ROUTES.find((r) => r.name === activeLink);
    for (const { name, url } of start ? [...others, start] : others) {
      await headerNav.getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(url);
    }
  });

  test('footer shows expected links', async ({ page }) => {
    await page.goto(path);
    const footerNav = page.getByRole('navigation', { name: 'footer navigation' });
    await expect(footerNav).toBeVisible();
    for (const name of FOOTER_LINKS) {
      await expect(footerNav.getByRole('link', { name, exact: true })).toBeVisible();
    }
  });

  test(`footer navigation links go to correct routes (from ${path})`, async ({ page }) => {
    await page.goto(path);

    await clickFooterLink(page, 'Privacy');
    await expect(page).toHaveURL(/\/privacy\/?$/);

    // Favorite Articles may route to /articles or /articles/1
    const fav = page.getByRole('navigation', { name: 'footer navigation' }).getByRole('link', { name: 'Favorite Articles', exact: true });
    await fav.scrollIntoViewIfNeeded();
    const href = await fav.getAttribute('href');
    expect(href).toMatch(/\/articles(\/\d+)?\/?$/);
    if (href) {
      await page.goto(href);
    }
    await expect(page).toHaveURL(/\/articles(\/\d+)?\/?$/, { timeout: 15000 });

    await clickFooterLink(page, 'About');
    await expect(page).toHaveURL(/\/about\/?$/);

    await clickFooterLink(page, 'Home');
    await expect(page).toHaveURL(/\/?$/);
  });
}
