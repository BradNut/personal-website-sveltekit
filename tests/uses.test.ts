import { expect, test } from '@playwright/test';

test.describe('Uses page', () => {
  test('has expected main heading', async ({ page }) => {
    await page.goto('/uses');
    await expect(page.getByRole('heading', { level: 1, name: '/Uses' })).toBeVisible();
  });

  test('header/footer links hover: color becomes shellYellow', async ({ page }) => {
    await page.goto('/uses');

    const shellYellow = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.color = 'var(--shellYellow)';
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });

    const areas = ['header[aria-label="header navigation"]', 'footer nav[aria-label="footer navigation"]'];

    for (const area of areas) {
      const nav = page.locator(area);
      await expect(nav).toBeVisible();

      const link = nav.getByRole('link', { name: 'Uses', exact: true });
      await expect(link).toBeVisible();

      const before = await link.evaluate((el) => getComputedStyle(el as Element).color);
      await link.hover();
      const after = await link.evaluate((el) => getComputedStyle(el as Element).color);

      expect(after).toBe(shellYellow);
      expect(after).not.toBe(before);
    }
  });

  test('current page (Uses) link is active in header and footer', async ({ page }) => {
    await page.goto('/uses');
    const areas = ['header[aria-label="header navigation"]', 'footer nav[aria-label="footer navigation"]'];
    for (const area of areas) {
      const nav = page.locator(area);
      const usesLink = nav.getByRole('link', { name: 'Uses', exact: true });
      await expect(usesLink).toBeVisible();
      const isActive = await usesLink.evaluate((el) => (el as Element).classList.contains('active'));
      expect(isActive).toBeTruthy();
    }
  });

  test('hero image visible with correct alt text', async ({ page }) => {
    await page.goto('/uses');
    await expect(page.getByAltText('Clean desk with Samsung monitor and Ducky Keyboard')).toBeVisible();
  });

  test('intro external links are accessible by aria-label-based names', async ({ page }) => {
    await page.goto('/uses');

    // ExternalLink.svelte sets accessible name as: "Open {ariaLabel|title|href} externally"
    await expect(page.getByRole('link', { name: /Open\s+Wes Bos' Website\s+externally/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Open\s+Wes Bos' Uses Page\s+externally/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Open\s+Uses\.tech\s+externally/i })).toBeVisible();
  });

  test('sections and subsections render', async ({ page }) => {
    await page.goto('/uses');

    await expect(page.getByRole('heading', { level: 2, name: 'Development' })).toBeVisible();

    // h3 subsections in development.svelte
    const subsections = ['Terminal & Shell Setup', 'Useful System Packages', 'Software', 'Useful Applications', 'Browsers'];
    for (const name of subsections) {
      await expect(page.getByRole('heading', { level: 3, name })).toBeVisible();
    }
  });

  test('a few key external links in Development section are present', async ({ page }) => {
    await page.goto('/uses');

    // Select within the Development section to be robust
    const devSection = page.locator('section#uses-development');
    await expect(devSection).toBeVisible();

    const expectedLinks = [
      /Open\s+Bradley Shellnut Computer Setup\s+externally/i,
      /Open\s+Dotfiles\s+externally/i,
      /Open\s+Tabby\s+externally/i,
      /Open\s+Starship\s+externally/i,
      /Open\s+ZimFW\s+externally/i,
      /Open\s+Linux Brew\s+externally/i,
      /Open\s+Homebrew\s+externally/i,
      /Open\s+TLDR Man Pages\s+externally/i,
      /Open\s+Trash-CLI\s+externally/i,
      /Open\s+VSCodium\s+externally/i,
      /Open\s+VSCode Extensions List\s+externally/i,
      /Open\s+Sublime Text 3\s+externally/i,
      /Open\s+Sublime Text Packages List\s+externally/i,
      /Open\s+IntelliJ IDEA\s+externally/i,
      /Open\s+IntelliJ Plugins\s+externally/i,
      /Open\s+Bruno\s+externally/i,
      /Open\s+Brave Browser\s+externally/i,
      /Open\s+Firefox\s+externally/i,
    ];

    for (const pattern of expectedLinks) {
      await expect(devSection.getByRole('link', { name: pattern })).toBeVisible();
    }
  });

  // Header nav presence
  test('header navigation shows expected links', async ({ page }) => {
    await page.goto('/uses');
    const headerNav = page.locator('header[aria-label="header navigation"]');
    await expect(headerNav).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Portfolio', exact: true })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Uses', exact: true })).toBeVisible();
  });

  // Header navigation flow (starting on /uses)
  test('header navigation links go to correct routes (from /uses)', async ({ page }) => {
    await page.goto('/uses');
    const headerNav = page.locator('header[aria-label="header navigation"]');

    await headerNav.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/?$/);

    await headerNav.getByRole('link', { name: 'Portfolio', exact: true }).click();
    await expect(page).toHaveURL(/\/portfolio\/?$/);

    await headerNav.getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL(/\/?$/);

    await headerNav.getByRole('link', { name: 'Uses', exact: true }).click();
    await expect(page).toHaveURL(/\/uses\/?$/);
  });

  // Footer link presence
  test('footer shows expected links', async ({ page }) => {
    await page.goto('/uses');
    const footerNav = page.getByRole('navigation', { name: 'footer navigation' });
    await expect(footerNav).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Portfolio', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Uses', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Privacy', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Favorite Articles', exact: true })).toBeVisible();
  });

  // Footer navigation flow (starting on /uses)
  test('footer navigation links go to correct routes (from /uses)', async ({ page }) => {
    await page.goto('/uses');
    const footerNav = page.getByRole('navigation', { name: 'footer navigation' });

    await footerNav.getByRole('link', { name: 'Privacy', exact: true }).scrollIntoViewIfNeeded();
    await footerNav.getByRole('link', { name: 'Privacy', exact: true }).click();
    await expect(page).toHaveURL(/\/privacy\/?$/);

    const fav = footerNav.getByRole('link', { name: 'Favorite Articles', exact: true });
    await fav.scrollIntoViewIfNeeded();
    const href = await fav.getAttribute('href');
    expect(href).toBeTruthy();
    if (href) {
      expect(href).toMatch(/\/articles(\/\d+)?\/?$/);
      await page.goto(href);
      await expect(page).toHaveURL(/\/articles(\/\d+)?\/?$/, { timeout: 15000 });
    }

    await footerNav.getByRole('link', { name: 'About', exact: true }).scrollIntoViewIfNeeded();
    await footerNav.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/?$/);

    await footerNav.getByRole('link', { name: 'Home', exact: true }).scrollIntoViewIfNeeded();
    await footerNav.getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL(/\/?$/);
  });
});
