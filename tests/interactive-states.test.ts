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

test.describe('Interactive states: pagination current page', () => {
  const resolveColor = (page: import('@playwright/test').Page, variable: string) =>
    page.evaluate((v) => {
      const probe = document.createElement('div');
      probe.style.color = `var(${v})`;
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    }, variable);

  const backgroundOf = (locator: import('@playwright/test').Locator) => locator.evaluate((el) => getComputedStyle(el).backgroundColor);

  test('current page is filled yellow with dark bold text', async ({ page }) => {
    await page.goto('/articles/1');
    const current = page.locator('.top-pagination [data-pagination-page][aria-current="page"]');
    await expect(current).toHaveCount(1);

    const styles = await current.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { background: cs.backgroundColor, color: cs.color, weight: cs.fontWeight };
    });
    expect(styles.background).toBe(await resolveColor(page, '--shellYellow'));
    expect(styles.color).toBe(await resolveColor(page, '--black'));
    expect(styles.weight).toBe('700');
  });

  test('non-current page is transparent until hovered, then filled yellow', async ({ page }) => {
    await page.goto('/articles/1');
    const other = page.locator('.top-pagination [data-pagination-page]:not([aria-current])').first();
    await expect(other).not.toHaveAttribute('aria-current');
    expect(await backgroundOf(other)).toBe('rgba(0, 0, 0, 0)');
    expect(await other.evaluate((el) => getComputedStyle(el).fontWeight)).toBe('400');

    await other.hover();
    await expect.poll(() => backgroundOf(other)).toBe(await resolveColor(page, '--shellYellow'));
  });

  test('disabled previous button stays transparent on hover', async ({ page }) => {
    await page.goto('/articles/1');
    const prev = page.locator('.top-pagination [data-pagination-prev]');
    await expect(prev).toBeDisabled();

    await prev.hover({ force: true });
    expect(await backgroundOf(prev)).toBe('rgba(0, 0, 0, 0)');
  });

  test('previous and next buttons have equal padding', async ({ page }) => {
    await page.goto('/articles/1');
    const paddingOf = (selector: string) => page.locator(`.top-pagination ${selector}`).evaluate((el) => getComputedStyle(el).padding);

    const prevPadding = await paddingOf('[data-pagination-prev]');
    expect(prevPadding).toBe('10px');
    expect(await paddingOf('[data-pagination-next]')).toBe(prevPadding);
  });
});

test.describe('Interactive states: pagination prev/next hover', () => {
  const resolveColor = (page: import('@playwright/test').Page, variable: string) =>
    page.evaluate((v) => {
      const probe = document.createElement('div');
      probe.style.color = `var(${v})`;
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    }, variable);

  const backgroundOf = (locator: import('@playwright/test').Locator) => locator.evaluate((el) => getComputedStyle(el).backgroundColor);

  for (const { name, path, selector } of [
    { name: 'next', path: '/articles/1', selector: '[data-pagination-next]' },
    { name: 'next', path: '/articles/2', selector: '[data-pagination-next]' },
    { name: 'previous', path: '/articles/2', selector: '[data-pagination-prev]' },
  ]) {
    test(`enabled ${name} button on ${path} is transparent until hovered, then filled yellow`, async ({ page }) => {
      await page.goto(path);
      const button = page.locator(`.top-pagination ${selector}`);
      await expect(button).toBeEnabled();
      expect(await backgroundOf(button)).toBe('rgba(0, 0, 0, 0)');

      await button.hover();
      await expect.poll(() => backgroundOf(button)).toBe(await resolveColor(page, '--shellYellow'));
    });
  }
});

test.describe('Interactive states: pagination aria-current', () => {
  test('aria-current="page" marks exactly the cell Bits UI selects', async ({ page }) => {
    await page.goto('/articles/1');
    const cells = page.locator('.top-pagination [data-pagination-page]');
    await expect(cells.first()).toBeVisible();

    const mismatches = await cells.evaluateAll((els) =>
      els.filter((el) => el.hasAttribute('data-selected') !== (el.getAttribute('aria-current') === 'page')).map((el) => el.textContent?.trim()),
    );
    expect(mismatches).toEqual([]);
    await expect(page.locator('.top-pagination [data-pagination-page][data-selected]')).toHaveAttribute('aria-current', 'page');
  });

  test('aria-current follows the selected cell before navigation completes', async ({ page }) => {
    await page.goto('/articles/1');
    const top = page.locator('.top-pagination');
    const target = top.locator('[data-pagination-page]:not([data-selected])').first();
    await expect(target).toBeVisible();
    const label = await target.getAttribute('aria-label');

    // Hold the client-side data request so the route's currentPage stays on the old page.
    await page.route('**/__data.json*', () => {});
    await target.click();

    const clicked = top.getByRole('button', { name: label ?? '', exact: true });
    await expect(clicked).toHaveAttribute('data-selected', '');
    await expect(clicked).toHaveAttribute('aria-current', 'page');
    await expect(top.locator('[aria-current="page"]')).toHaveCount(1);
  });
});
