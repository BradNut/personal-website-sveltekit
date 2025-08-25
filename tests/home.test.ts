import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
  test('has expected main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText("Hello! I'm Bradley Shellnut.");
  });

  test('header/footer links hover: color becomes shellYellow', async ({ page }) => {
    await page.goto('/');

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

      const before = await link.evaluate((el) => {
        const cs = getComputedStyle(el as Element) as CSSStyleDeclaration;
        return { color: cs.color };
      });
      await link.hover();
      const after = await link.evaluate((el) => {
        const cs = getComputedStyle(el as Element) as CSSStyleDeclaration;
        return { color: cs.color };
      });

      expect(after.color).toBe(shellYellow);
      expect(after.color).not.toBe(before.color);
    }
  });

  test('current page (Home) link is active in header and footer', async ({ page }) => {
    await page.goto('/');
    const areas = [
      'header[aria-label="header navigation"]',
      'footer nav[aria-label="footer navigation"]',
    ];
    for (const area of areas) {
      const nav = page.locator(area);
      const link = nav.getByRole('link', { name: 'Home', exact: true });
      await expect(link).toBeVisible();
      const isActive = await link.evaluate((el) => (el as Element).classList.contains('active'));
      expect(isActive).toBeTruthy();
    }
  });

  test('header navigation links go to correct routes', async ({ page }) => {
    await page.goto('/');
    const headerNav = page.locator('header[aria-label="header navigation"]');

    // About
    await headerNav.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/?$/);

    // Portfolio
    await headerNav.getByRole('link', { name: 'Portfolio', exact: true }).click();
    await expect(page).toHaveURL(/\/portfolio\/?$/);

    // Uses
    await headerNav.getByRole('link', { name: 'Uses', exact: true }).click();
    await expect(page).toHaveURL(/\/uses\/?$/);

    // Home
    await headerNav.getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL(/\/?$/);
  });

  test('header navigation shows expected links', async ({ page }) => {
    await page.goto('/');
    const headerNavContainer = page.locator('header[aria-label="header navigation"]');
    await expect(headerNavContainer).toBeVisible();
    await expect(headerNavContainer.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(headerNavContainer.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(headerNavContainer.getByRole('link', { name: 'Portfolio', exact: true })).toBeVisible();
    await expect(headerNavContainer.getByRole('link', { name: 'Uses', exact: true })).toBeVisible();
  });

  test('shows key sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 2, name: 'Currently listening to:' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Favorite Articles' })).toBeVisible();
  });

  test('renders Bandcamp albums (max 6)', async ({ page }) => {
    await page.goto('/');
    const albumImages = page.locator('.albumsStyles .album-artwork');
    const count = await albumImages.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(6);
  });

  test('renders at least one favorite article card', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('section.articles article.card');
    await expect(cards.first()).toBeVisible();
  });

  test('"more articles" link points to /articles and navigates', async ({ page }) => {
    await page.goto('/');
    const more = page.locator('a.moreArticles');
    await expect(more).toHaveAttribute('href', '/articles/1');
    await expect(more).toContainText('more articles');
    await more.scrollIntoViewIfNeeded();
    const href = await more.getAttribute('href');
    expect(href).toMatch(/\/articles(\/\d+)?\/?$/);
    await page.goto(href!);
    await expect(page).toHaveURL(/\/articles(\/\d+)?\/?$/, { timeout: 15000 });
  });

  test('has social/contact links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Contact through LinkedIn', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact through Github', exact: true })).toBeVisible();
  });

  test('footer shows expected links', async ({ page }) => {
    await page.goto('/');
    const footerNav = page.getByRole('navigation', { name: 'footer navigation' });
    await expect(footerNav).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Portfolio', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Uses', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Privacy', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Favorite Articles', exact: true })).toBeVisible();
  });

  test('small viewport: Bandcamp grid 2x3 above Articles', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 1000 }); // <1000px and >575px
    await page.goto('/');

    const albumsGrid = page.locator('.albumsStyles');
    const articlesSection = page.locator('section.articles');

    await expect(albumsGrid).toBeVisible();
    await expect(articlesSection).toBeVisible();

    // Order: Bandcamp above Articles
    const [albumsTop, articlesTop] = await Promise.all([
      albumsGrid.boundingBox().then((b) => b?.y ?? Number.POSITIVE_INFINITY),
      articlesSection.boundingBox().then((b) => b?.y ?? Number.NEGATIVE_INFINITY),
    ]);
    expect(albumsTop).toBeLessThan(articlesTop);

    // Layout: assert first two items share the same row, third wraps to next row
    const albumItems = page.locator('.albumsStyles .album-artwork');
    const n = await albumItems.count();
    expect(n).toBeGreaterThanOrEqual(3);
    const [b0, b1, b2] = await Promise.all([
      albumItems.nth(0).boundingBox(),
      albumItems.nth(1).boundingBox(),
      albumItems.nth(2).boundingBox(),
    ]);
    expect(b0 && b1 && b2).toBeTruthy();
    if (b0 && b1 && b2) {
      expect(Math.abs(b0.y - b1.y)).toBeLessThan(6); // same row
      expect(b2.y).toBeGreaterThan(b0.y + 10); // next row
    }
  });

  test('mobile viewport: Bandcamp vertical scroll, Articles stacked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 }); // <=575px rules apply
    await page.goto('/');

    const albumsGrid = page.locator('.albumsStyles');
    const articlesSection = page.locator('section.articles');

    await expect(albumsGrid).toBeVisible();
    await expect(articlesSection).toBeVisible();

    // Order: Bandcamp above Articles
    const [albumsTop, articlesTop] = await Promise.all([
      albumsGrid.boundingBox().then((b) => b?.y ?? Number.POSITIVE_INFINITY),
      articlesSection.boundingBox().then((b) => b?.y ?? Number.NEGATIVE_INFINITY),
    ]);
    expect(albumsTop).toBeLessThan(articlesTop);

    // Layout: single column and scrollable vertically
    const scrollInfo = await albumsGrid.evaluate((el) => ({
      overflowY: getComputedStyle(el as HTMLElement).overflowY,
      scrollHeight: (el as HTMLElement).scrollHeight,
      clientHeight: (el as HTMLElement).clientHeight,
    }));
    expect(scrollInfo.clientHeight).toBeLessThan(scrollInfo.scrollHeight);
    expect(['auto', 'scroll']).toContain(scrollInfo.overflowY);

    // Albums are a vertical list (y increasing); first two must be on different rows
    const albumItems = page.locator('.albumsStyles .album-artwork');
    const m = await albumItems.count();
    expect(m).toBeGreaterThanOrEqual(2);
    const [a0, a1] = await Promise.all([
      albumItems.nth(0).boundingBox(),
      albumItems.nth(1).boundingBox(),
    ]);
    expect(a0 && a1).toBeTruthy();
    if (a0 && a1) {
      expect(a1.y).toBeGreaterThan(a0.y + 10);
      expect(Math.abs(a1.x - a0.x)).toBeLessThan(6);
    }

    // Articles are a vertical list (same x, increasing y)
    const boxes = await page.locator('section.articles article.card').evaluateAll((els) =>
      (els as HTMLElement[]).slice(0, Math.min(4, els.length)).map((el) => el.getBoundingClientRect())
    );
    expect(boxes.length).toBeGreaterThan(0);
    const x0 = boxes[0].left;
    for (let i = 1; i < boxes.length; i++) {
      expect(Math.abs(boxes[i].left - x0)).toBeLessThan(6);
      expect(boxes[i].top).toBeGreaterThan(boxes[i - 1].top);
    }
  });
});
