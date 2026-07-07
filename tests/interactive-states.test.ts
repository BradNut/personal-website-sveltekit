import { expect, test } from '@playwright/test';

test.describe('Interactive states: focus-visible ring', () => {
  test('Tab to a link shows focus-visible outline with shellYellow color', async ({ page }) => {
    await page.goto('/');

    // Tab to first focusable link
    await page.keyboard.press('Tab');

    // Find the focused element
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();

    const styles = await focused.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        outlineStyle: cs.outlineStyle,
        outlineOffset: cs.outlineOffset,
        outlineColor: cs.outlineColor,
      };
    });

    // Should have a solid outline
    expect(styles.outlineStyle).toBe('solid');
    // Outline offset should be 2px
    expect(styles.outlineOffset).toBe('2px');

    // Resolve shellYellow to compare
    const shellYellow = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.color = 'var(--shellYellow)';
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });
    expect(styles.outlineColor).toBe(shellYellow);
  });
});

test.describe('Interactive states: global link transition', () => {
  test('body links have color transition', async ({ page }) => {
    await page.goto('/');

    // Check an inline body link (e.g. the "cocktails" link)
    const bodyLink = page.locator('.home p a').first();
    await expect(bodyLink).toBeVisible();

    const transition = await bodyLink.evaluate((el) => {
      return getComputedStyle(el).transition;
    });

    // Transition should include color
    expect(transition).toContain('color');
    expect(transition).toMatch(/0\.\d+s/);
  });
});

test.describe('Interactive states: header nav focus-visible', () => {
  test('header nav link shows underline on focus-visible, no outline ring', async ({ page }) => {
    await page.goto('/');

    // Tab through the page until a header nav link receives focus
    let attempts = 0;
    let focusedNavLink = null;
    while (attempts < 15) {
      await page.keyboard.press('Tab');
      attempts++;
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        if (el?.tagName !== 'A') return null;
        const nav = el.closest('nav[aria-label="header navigation"]');
        if (!nav) return null;
        return true;
      });
      if (focused) {
        focusedNavLink = page.locator(':focus');
        break;
      }
    }

    expect(focusedNavLink).not.toBeNull();

    const styles = await (focusedNavLink as ReturnType<typeof page.locator>).evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        outlineStyle: cs.outlineStyle,
        outlineWidth: cs.outlineWidth,
      };
    });

    // No outline ring on nav links — outline suppressed
    const noOutline = styles.outlineStyle === 'none' || styles.outlineWidth === '0px';
    expect(noOutline).toBeTruthy();
  });
});

test.describe('Interactive states: album artwork hover', () => {
  test('album card lifts and image scales on hover', async ({ page }) => {
    await page.goto('/');

    // Skip if no albums loaded
    const albumCount = await page.locator('.albumsStyles .album-artwork').count();
    if (albumCount === 0) {
      test.skip();
      return;
    }

    const firstAlbum = page.locator('.albumStyles').first();
    await expect(firstAlbum).toBeVisible();

    // Get transform before hover
    const beforeTransform = await firstAlbum.evaluate((el) => {
      return getComputedStyle(el).transform;
    });

    // Hover over album
    await firstAlbum.hover();

    // Wait for transition
    await page.waitForTimeout(400);

    const afterStyles = await firstAlbum.evaluate((el) => {
      const cs = getComputedStyle(el);
      const img = el.querySelector('.album-artwork');
      const imgTransform = img ? getComputedStyle(img).transform : 'none';
      return {
        cardTransform: cs.transform,
        imgTransform,
      };
    });

    // Card should have translateY (matrix with non-zero ty component)
    expect(afterStyles.cardTransform).not.toBe('none');
    expect(afterStyles.cardTransform).not.toBe(beforeTransform);
    // Image should be scaled
    expect(afterStyles.imgTransform).not.toBe('none');
  });
});

test.describe('Interactive states: article card hover lift', () => {
  test('article card lifts on hover with elevated shadow', async ({ page }) => {
    await page.goto('/');

    const articleCount = await page.locator('section.articles article').count();
    if (articleCount === 0) {
      test.skip();
      return;
    }

    const firstCard = page.locator('section.articles article').first();
    await expect(firstCard).toBeVisible();

    const beforeStyles = await firstCard.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { transform: cs.transform, boxShadow: cs.boxShadow };
    });

    await firstCard.hover();
    await page.waitForTimeout(400);

    const afterStyles = await firstCard.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { transform: cs.transform, boxShadow: cs.boxShadow };
    });

    // Should have translateY (non-'none' transform)
    expect(afterStyles.transform).not.toBe('none');
    expect(afterStyles.transform).not.toBe(beforeStyles.transform);
    // Shadow should change (elevated)
    expect(afterStyles.boxShadow).not.toBe(beforeStyles.boxShadow);
  });
});

test.describe('Interactive states: footer nav transition', () => {
  test('footer nav links have color transition', async ({ page }) => {
    await page.goto('/');

    const footerLink = page.locator('footer nav[aria-label="footer navigation"] a').first();
    await expect(footerLink).toBeVisible();

    const transition = await footerLink.evaluate((el) => {
      return getComputedStyle(el).transition;
    });

    expect(transition).toContain('color');
    expect(transition).toMatch(/0\.\d+s/);
  });
});

test.describe('Interactive states: ContactHub color transition', () => {
  test('social hub icons have color in their transition property', async ({ page }) => {
    await page.goto('/');

    // Footer has ContactHub social icons
    const hubIcon = page.locator('.hub-icon').first();
    await expect(hubIcon).toBeVisible();

    const transitionProperty = await hubIcon.evaluate((el) => {
      return getComputedStyle(el).transitionProperty;
    });

    // Should include both transform and color (or 'all' which covers both)
    const coversColorAndTransform =
      transitionProperty === 'all' || (transitionProperty.includes('color') && transitionProperty.includes('transform'));
    expect(coversColorAndTransform).toBeTruthy();
  });
});
