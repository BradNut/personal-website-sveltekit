import { expect, test } from '@playwright/test';

test.describe('Portfolio page', () => {
  test('has expected main heading', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page.getByRole('heading', { level: 1, name: 'Portfolio!' })).toBeVisible();
  });

  test('header/footer links hover: color becomes shellYellow', async ({ page }) => {
    await page.goto('/portfolio');

    const shellYellow = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.color = 'var(--shellYellow)';
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });

    const areas = [
      'header[aria-label="header navigation"]',
      'footer nav[aria-label="footer navigation"]',
    ];

    for (const area of areas) {
      const nav = page.locator(area);
      await expect(nav).toBeVisible();

      const link = nav.getByRole('link', { name: 'Portfolio', exact: true });
      await expect(link).toBeVisible();

      const before = await link.evaluate((el) => getComputedStyle(el as Element).color);
      await link.hover();
      const after = await link.evaluate((el) => getComputedStyle(el as Element).color);

      expect(after).toBe(shellYellow);
      expect(after).not.toBe(before);
    }
  });

  test('current page (Portfolio) link is active in header and footer', async ({ page }) => {
    await page.goto('/portfolio');
    const areas = [
      'header[aria-label="header navigation"]',
      'footer nav[aria-label="footer navigation"]',
    ];
    for (const area of areas) {
      const nav = page.locator(area);
      const portfolioLink = nav.getByRole('link', { name: 'Portfolio', exact: true });
      await expect(portfolioLink).toBeVisible();
      const isActive = await portfolioLink.evaluate((el) => (el as Element).classList.contains('active'));
      expect(isActive).toBeTruthy();
    }
  });

  test('tabs render and can switch between Personal and Professional', async ({ page }) => {
    await page.goto('/portfolio');

    // Prefer role-based tab selection; fall back to data attribute if role is not present
    const personalTab = page.getByRole('tab', { name: 'Personal' }).or(page.locator('[data-tabs-trigger]', { hasText: 'Personal' }));
    const professionalTab = page.getByRole('tab', { name: 'Professional' }).or(page.locator('[data-tabs-trigger]', { hasText: 'Professional' }));

    await expect(personalTab).toBeVisible();
    await expect(professionalTab).toBeVisible();

    // Personal content visible by default (card heading exists)
    const personalCardHeading = page.locator('.portfolio-picture h2', { hasText: 'Personal Website' }).first();
    await expect(personalCardHeading).toBeVisible();

    // Switch to Professional
    await professionalTab.click();

    // Professional content appears, personal may hide
    const professionalCardHeading = page.locator('.portfolio-picture h2', { hasText: 'Mark Shellnut Architect' }).first();
    await expect(professionalCardHeading).toBeVisible();
  });

  test('personal tab: key cards, images, and external links are accessible', async ({ page }) => {
    await page.goto('/portfolio');

    // Ensure on Personal tab
    const personalTab = page.getByRole('tab', { name: 'Personal' }).or(page.locator('[data-tabs-trigger]', { hasText: 'Personal' }));
    await personalTab.click();

    // Headings (scoped to portfolio cards to avoid strict-mode conflicts)
    await expect(page.locator('.portfolio-picture h2', { hasText: 'Personal Website' }).first()).toBeVisible();
    await expect(page.locator('.portfolio-picture h2', { hasText: 'Wedding Website' }).first()).toBeVisible();
    await expect(page.locator('.portfolio-picture h2', { hasText: 'Old Personal Website' }).first()).toBeVisible();

    // Images by alt text
    await expect(page.getByAltText("Picture of Bradley Shellnut's Personal Website")).toBeVisible();
    await expect(page.getByAltText('Picture of NextJS Wedding Website')).toBeVisible();
    await expect(page.getByAltText('Home Page of the old bradleyshellnut.com website')).toBeVisible();

    // External links (use visible link names)
    await expect(page.getByRole('link', { name: /GitHub repository/i }).first()).toBeVisible();
  });

  test('professional tab: card renders with external link', async ({ page }) => {
    await page.goto('/portfolio');

    const professionalTab = page.getByRole('tab', { name: 'Professional' }).or(page.locator('[data-tabs-trigger]', { hasText: 'Professional' }));
    await professionalTab.click();

    const professionalCard = page
      .locator('.portfolio')
      .filter({ has: page.locator('.portfolio-picture h2', { hasText: 'Mark Shellnut Architect' }) })
      .first();

    await expect(professionalCard).toBeVisible();
    // Accessible name derived from aria-label in ExternalLink.svelte
    await expect(
      professionalCard.getByRole('link', { name: /Open\s+View Mark Shellnut Architect\s+externally/i })
    ).toBeVisible();
  });

  // Mirror header link presence from other pages
  test('header navigation shows expected links', async ({ page }) => {
    await page.goto('/portfolio');
    const headerNav = page.locator('header[aria-label="header navigation"]');
    await expect(headerNav).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Portfolio', exact: true })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Uses', exact: true })).toBeVisible();
  });

  // Mirror navigation flow via header (starting on /portfolio)
  test('header navigation links go to correct routes (from /portfolio)', async ({ page }) => {
    await page.goto('/portfolio');
    const headerNav = page.locator('header[aria-label="header navigation"]');

    await headerNav.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/?$/);

    await headerNav.getByRole('link', { name: 'Uses', exact: true }).click();
    await expect(page).toHaveURL(/\/uses\/?$/);

    await headerNav.getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL(/\/?$/);

    await headerNav.getByRole('link', { name: 'Portfolio', exact: true }).click();
    await expect(page).toHaveURL(/\/portfolio\/?$/);
  });

  // Mirror footer link presence from other pages
  test('footer shows expected links', async ({ page }) => {
    await page.goto('/portfolio');
    const footerNav = page.getByRole('navigation', { name: 'footer navigation' });
    await expect(footerNav).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Portfolio', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Uses', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Privacy', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Favorite Articles', exact: true })).toBeVisible();
  });

  // Mirror navigation via footer (starting on /portfolio)
  test('footer navigation links go to correct routes (from /portfolio)', async ({ page }) => {
    await page.goto('/portfolio');
    const footerNav = page.getByRole('navigation', { name: 'footer navigation' });

    await footerNav.getByRole('link', { name: 'Privacy', exact: true }).scrollIntoViewIfNeeded();
    await footerNav.getByRole('link', { name: 'Privacy', exact: true }).click();
    await expect(page).toHaveURL(/\/privacy\/?$/);

    // Favorite Articles may route to /articles or /articles/1
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
