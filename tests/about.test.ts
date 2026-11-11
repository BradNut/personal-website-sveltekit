import { expect, test } from '@playwright/test';
import { registerLayoutNavTests } from './helpers/layoutNavTests';

test.describe('About page', () => {
  test('has expected main heading', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { level: 1, name: 'About' })).toBeVisible();
  });

  registerLayoutNavTests({ path: '/about', activeLink: 'About', hoverLink: 'Portfolio' });

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
    await expect(page.getByText('Outside of work, I’ve learned from:')).toBeVisible();
  });

  test('renders one compact card per learning source', async ({ page }) => {
    await page.goto('/about');
    const list = page.locator('ul.learning-sources');
    await expect(list).toBeVisible();
    await expect(list.locator('> li.source-card')).toHaveCount(6);
  });

  test('learning source links point to expected URLs', async ({ page }) => {
    await page.goto('/about');
    const list = page.locator('ul.learning-sources');

    const sources = [
      { name: 'Wes Bos', href: 'https://wesbos.com/courses' },
      { name: 'Scott Tolinski', href: 'https://tolin.ski' },
      { name: 'Josh Comeau', href: 'https://www.joshwcomeau.com' },
      { name: 'Amy Kapernick', href: 'https://www.amyskapers.dev/' },
      { name: 'Matt Pocock', href: 'https://www.aihero.dev/' },
      { name: 'Syntax', href: 'https://syntax.fm' },
    ];

    for (const expected of sources) {
      const link = list.locator(`a[href="${expected.href}"]`);
      await expect(link).toBeVisible();
      await expect(link).toHaveText(new RegExp(expected.name));
    }
  });

  test('learning source cards open their links in a new tab safely', async ({ page }) => {
    await page.goto('/about');
    const links = page.locator('ul.learning-sources a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      const link = links.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('href', /^https:\/\//);
    }
  });

  test('notable works are shown for the sources that have one', async ({ page }) => {
    await page.goto('/about');
    const list = page.locator('ul.learning-sources');

    await expect(list.locator('a[href="https://levelup.video"]')).toHaveText(/Level Up Tutorials/);
    await expect(list.locator('a[href="https://www.joyofreact.com"]')).toHaveText(/The Joy of React/);
    await expect(list.locator('a[href="https://www.youtube.com/watch?v=taJlPG82Ucw"]')).toBeVisible();
  });

  test('every learning source card lists at least one subject', async ({ page }) => {
    await page.goto('/about');
    const cards = page.locator('ul.learning-sources > li.source-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      const subjects = cards.nth(i).locator('ul.subjects > li');
      expect(await subjects.count()).toBeGreaterThan(0);
    }
  });

  test('subjects render as low-emphasis outline badges, not filled ones', async ({ page }) => {
    await page.goto('/about');
    const badges = page.locator('ul.learning-sources .badge');
    const count = await badges.count();
    expect(count).toBeGreaterThan(5);
    for (let i = 0; i < count; i += 1) {
      await expect(badges.nth(i)).toHaveClass(/badge-outline/);
      await expect(badges.nth(i)).not.toHaveClass(/badge-default/);
    }
  });

  test('learning source cards form a multi-column grid on desktop and stack on mobile', async ({ page }) => {
    await page.goto('/about');
    const list = page.locator('ul.learning-sources');

    const desktopColumns = await list.evaluate((el) => getComputedStyle(el as Element).gridTemplateColumns.split(' ').length);
    expect(desktopColumns).toBeGreaterThan(1);

    await page.setViewportSize({ width: 375, height: 800 });
    const mobileColumns = await list.evaluate((el) => getComputedStyle(el as Element).gridTemplateColumns.split(' ').length);
    expect(mobileColumns).toBe(1);

    const overflowX = await list.evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(overflowX).toBeLessThanOrEqual(2);
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
