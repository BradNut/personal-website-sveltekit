import { expect, test } from '@playwright/test';

test.describe('About page', () => {
  test('has expected main heading', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { level: 1, name: 'About' })).toBeVisible();
  });

  test('header/footer links hover: color becomes shellYellow', async ({ page }) => {
    await page.goto('/about');

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
      // Sanity: it should change from the default color
      expect(after.color).not.toBe(before.color);
    }
  });

  test('current page (About) link is active in header and footer', async ({ page }) => {
    await page.goto('/about');
    const areas = [
      'header[aria-label="header navigation"]',
      'footer nav[aria-label="footer navigation"]',
    ];
    for (const area of areas) {
      const nav = page.locator(area);
      const aboutLink = nav.getByRole('link', { name: 'About', exact: true });
      await expect(aboutLink).toBeVisible();
      const isActive = await aboutLink.evaluate((el) => (el as Element).classList.contains('active'));
      expect(isActive).toBeTruthy();
    }
  });

  test('tech list hover changes color to shellYellow', async ({ page }) => {
    await page.goto('/about');
    const techList = page.locator('.tech-list');
    await expect(techList).toBeVisible();

    // Resolve the actual computed rgb color value for --shellYellow in the browser context
    const shellYellow = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.color = 'var(--shellYellow)';
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });

    const names = ['Svelte', 'Hono', 'TypeScript', 'Drizzle ORM', 'React', 'Next.js', 'Docker'];
    for (const name of names) {
      const link = techList.locator(`a[title="${name}"]`).first();
      await expect(link).toBeVisible();

      const before = await link.evaluate((el) => getComputedStyle(el as Element).color);
      await link.hover();
      const after = await link.evaluate((el) => getComputedStyle(el as Element).color);

      expect(before).not.toBe(shellYellow);
      expect(after).toBe(shellYellow);
    }
  });

  test('tech list has accessible links for key technologies', async ({ page }) => {
    await page.goto('/about');
    const techList = page.locator('.tech-list');
    await expect(techList).toBeVisible();
    const names = ['Svelte', 'Hono', 'TypeScript', 'Drizzle ORM', 'React', 'Next.js', 'Docker'];
    for (const name of names) {
      const link = techList.locator(`a[title="${name}"]`).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAccessibleName(new RegExp(name, 'i'));
    }
  });

  test('tablet viewport (~800px): extracurricular wraps to multiple rows', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 1000 });
    await page.goto('/about');
    const container = page.locator('.extracurricular');
    await expect(container).toBeVisible();
    const cards = container.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
    const [c0, c1, c2] = await Promise.all([
      cards.nth(0).boundingBox(),
      cards.nth(1).boundingBox(),
      cards.nth(2).boundingBox(),
    ]);
    expect(c0 && c1 && c2).toBeTruthy();
    if (c0 && c1 && c2) {
      // first two side-by-side on same row, third wrapped below
      expect(Math.abs(c0.y - c1.y)).toBeLessThan(10);
      expect(c2.y).toBeGreaterThan(c0.y + 10);
    }
  });

  test('mobile viewport (375px): extracurricular cards stack vertically', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/about');
    const container = page.locator('.extracurricular');
    const cards = container.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(2);
    const [a, b] = await Promise.all([
      cards.nth(0).boundingBox(),
      cards.nth(1).boundingBox(),
    ]);
    expect(a && b).toBeTruthy();
    if (a && b) {
      expect(b.y).toBeGreaterThan(a.y + 10);
      expect(Math.abs(b.x - a.x)).toBeLessThan(40);
    }
  });

  // Mirror header link presence from home tests
  test('header navigation shows expected links', async ({ page }) => {
    await page.goto('/about');
    const headerNav = page.locator('header[aria-label="header navigation"]');
    await expect(headerNav).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Portfolio', exact: true })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Uses', exact: true })).toBeVisible();
  });

  // Mirror header navigation flow from home tests (starting on /about)
  test('header navigation links go to correct routes (from /about)', async ({ page }) => {
    await page.goto('/about');
    const headerNav = page.locator('header[aria-label="header navigation"]');

    await headerNav.getByRole('link', { name: 'Portfolio', exact: true }).click();
    await expect(page).toHaveURL(/\/portfolio\/?$/);

    await headerNav.getByRole('link', { name: 'Uses', exact: true }).click();
    await expect(page).toHaveURL(/\/uses\/?$/);

    await headerNav.getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL(/\/?$/);

    await headerNav.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/?$/);
  });

  // Mirror footer link presence from home tests
  test('footer shows expected links', async ({ page }) => {
    await page.goto('/about');
    const footerNav = page.getByRole('navigation', { name: 'footer navigation' });
    await expect(footerNav).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Portfolio', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Uses', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Privacy', exact: true })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Favorite Articles', exact: true })).toBeVisible();
  });

  // Mirror footer navigation flow from home tests (starting on /about)
  test('footer navigation links go to correct routes (from /about)', async ({ page }) => {
    await page.goto('/about');
    const footerNav = page.getByRole('navigation', { name: 'footer navigation' });

    await footerNav.getByRole('link', { name: 'Privacy', exact: true }).click();
    await expect(page).toHaveURL(/\/privacy\/?$/);

    // Favorite Articles may route to /articles or /articles/1
    await footerNav.getByRole('link', { name: 'Favorite Articles', exact: true }).click();
    await expect(page).toHaveURL(/\/articles(\/\d+)?\/?$/);

    await footerNav.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/?$/);

    await footerNav.getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL(/\/?$/);
  });

  // Mobile viewport: ensure cat section has no horizontal overflow and second image fits viewport
  test('mobile: cat section no horizontal overflow; second cat image fully visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/about');

    const catSection = page.locator('.cat-pics');
    await catSection.scrollIntoViewIfNeeded();

    // The cat section itself should not horizontally overflow its own box
    const sectionOverflowX = await catSection.evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(sectionOverflowX).toBeLessThanOrEqual(2);

    // Second image inside .cat-pics is fully within the cat section horizontally
    const img = page.locator('.cat-pics figure:nth-of-type(2) img');
    await expect(img).toBeVisible();

    const [imgBox, sectionBox] = await Promise.all([
      img.boundingBox(),
      catSection.boundingBox(),
    ]);
    expect(imgBox && sectionBox).toBeTruthy();
    if (imgBox && sectionBox) {
      expect(imgBox.x).toBeGreaterThanOrEqual(sectionBox.x - 1);
      expect(imgBox.x + imgBox.width).toBeLessThanOrEqual(sectionBox.x + sectionBox.width + 1);
    }
  });
});