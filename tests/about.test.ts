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

    const areas = ['nav[aria-label="header navigation"]', 'footer nav[aria-label="footer navigation"]'];

    for (const area of areas) {
      const nav = page.locator(area);
      await expect(nav).toBeVisible();

      const link = nav.getByRole('link', { name: 'Portfolio', exact: true });
      await expect(link).toBeVisible();

      const before = await link.evaluate((el) => {
        const cs = getComputedStyle(el as Element);
        return { color: cs.color };
      });
      await link.hover();
      // Wait for color transition to complete (0.2s ease)
      await page.waitForTimeout(300);
      const after = await link.evaluate((el) => {
        const cs = getComputedStyle(el as Element);
        return { color: cs.color };
      });

      expect(after.color).toBe(shellYellow);
      // Sanity: it should change from the default color
      expect(after.color).not.toBe(before.color);
    }
  });

  test('current page (About) link is active in header and footer', async ({ page }) => {
    await page.goto('/about');
    const areas = ['nav[aria-label="header navigation"]', 'footer nav[aria-label="footer navigation"]'];
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
      // Wait for color transition to complete (0.2s ease)
      await page.waitForTimeout(300);
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

  test('shows extracurricular learning sources intro', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText("Outside of work, I’ve learned from:")).toBeVisible();
  });

  test('renders a compact list of six learning sources', async ({ page }) => {
    await page.goto('/about');
    const list = page.locator('ul.learning-sources');
    await expect(list).toBeVisible();
    const items = list.locator('li');
    await expect(items).toHaveCount(6);
  });

  test('learning source links point to expected URLs', async ({ page }) => {
    await page.goto('/about');
    const list = page.locator('ul.learning-sources');

    const singleLinks = [
      { name: 'Wes Bos', href: 'https://wesbos.com/courses' },
      { name: 'Scott Tolinski', href: 'https://tolin.ski' },
      { name: 'Josh Comeau', href: 'https://www.joshwcomeau.com' },
      { name: 'Amy Kapernick', href: 'https://www.amyskapers.dev/' },
      { name: 'Matt Pocock', href: 'https://www.aihero.dev/' },
    ];

    for (const expected of singleLinks) {
      const link = list.locator(`a[href="${expected.href}"]`);
      await expect(link).toBeVisible();
      await expect(link).toHaveText(new RegExp(expected.name));
    }

    await expect(list.locator('a[href="https://www.youtube.com/watch?v=taJlPG82Ucw"]')).toBeVisible();
    await expect(list.locator('a[href="https://www.youtube.com/watch?v=Q1Y_g0wMwww"]')).toBeVisible();
  });

  test('learning sources have associated tags', async ({ page }) => {
    await page.goto('/about');
    const list = page.locator('ul.learning-sources');
    const tags = list.locator('.badge');
    const count = await tags.count();
    expect(count).toBeGreaterThan(5);
  });

  // Mirror header link presence from home tests
  test('header navigation shows expected links', async ({ page }) => {
    await page.goto('/about');
    const headerNav = page.locator('nav[aria-label="header navigation"]');
    await expect(headerNav).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Portfolio', exact: true })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Uses', exact: true })).toBeVisible();
  });

  // Mirror header navigation flow from home tests (starting on /about)
  test('header navigation links go to correct routes (from /about)', async ({ page }) => {
    await page.goto('/about');
    const headerNav = page.locator('nav[aria-label="header navigation"]');

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

    await footerNav.getByRole('link', { name: 'Privacy', exact: true }).scrollIntoViewIfNeeded();
    await footerNav.getByRole('link', { name: 'Privacy', exact: true }).click();
    await expect(page).toHaveURL(/\/privacy\/?$/);

    // Favorite Articles may route to /articles or /articles/1
    const fav = footerNav.getByRole('link', { name: 'Favorite Articles', exact: true });
    await fav.scrollIntoViewIfNeeded();
    const href = await fav.getAttribute('href');
    expect(href).toMatch(/\/articles(\/\d+)?\/?$/);
    if (href) {
      await page.goto(href);
    }
    await expect(page).toHaveURL(/\/articles(\/\d+)?\/?$/, { timeout: 15000 });

    await footerNav.getByRole('link', { name: 'About', exact: true }).scrollIntoViewIfNeeded();
    await footerNav.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/?$/);

    await footerNav.getByRole('link', { name: 'Home', exact: true }).scrollIntoViewIfNeeded();
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

    const [imgBox, sectionBox] = await Promise.all([img.boundingBox(), catSection.boundingBox()]);
    expect(imgBox && sectionBox).toBeTruthy();
    if (imgBox && sectionBox) {
      expect(imgBox.x).toBeGreaterThanOrEqual(sectionBox.x - 1);
      expect(imgBox.x + imgBox.width).toBeLessThanOrEqual(sectionBox.x + sectionBox.width + 1);
    }
  });

  test('renders decorative separators between sections', async ({ page }) => {
    await page.goto('/about');
    const separators = page.locator('[data-separator-root]');
    await expect(separators).toHaveCount(3);
    await expect(separators.first()).toBeVisible();
    const orientations = await separators.evaluateAll((els) => els.map((el) => (el as HTMLElement).dataset.orientation));
    expect(orientations.every((o) => o === 'horizontal')).toBeTruthy();
  });

  test('cat images are constrained to a consistent aspect ratio', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 1000 });
    await page.goto('/about');
    const catSection = page.locator('.cat-pics');
    await expect(catSection).toBeVisible();
    await catSection.scrollIntoViewIfNeeded();

    const aspectWrappers = catSection.locator('[data-aspect-ratio-root]');
    await expect(aspectWrappers).toHaveCount(2);
    await expect(aspectWrappers.first()).toBeVisible();

    const ratios = await aspectWrappers.evaluateAll((els) =>
      els.map((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width / rect.height;
      }),
    );
    for (const ratio of ratios) {
      expect(Math.abs(ratio - 4 / 3)).toBeLessThan(0.05);
    }
  });
});
