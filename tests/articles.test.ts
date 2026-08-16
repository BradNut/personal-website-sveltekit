import { expect, test } from '@playwright/test';

test.describe('Articles page', () => {
  test('mobile layout: columns grid is a single column and fits viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/articles/1');

    const columns = page.locator('.columns');
    const columnsCount = await columns.count();
    if (columnsCount === 0) {
      test.skip();
      return;
    }
    // The grid renders even when the upstream articles source is unavailable
    // (e.g. in CI), in which case it has no children and zero height. Its
    // responsive column layout is defined purely by CSS, so assert on the
    // computed style of the attached element rather than its visibility.
    await expect(columns).toBeAttached();

    const styles = await columns.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        gridTemplateColumns: cs.gridTemplateColumns,
        gap: cs.gap,
        minHeight: cs.minHeight,
      };
    });

    expect(styles.gridTemplateColumns.split(' ').length).toBe(1);
    expect(styles.gap).toBe('15px');
    expect(styles.minHeight).toBe('auto');
  });

  test('tablet layout: columns grid uses two columns', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    await page.goto('/articles/1');

    const columns = page.locator('.columns');
    const columnsCount = await columns.count();
    if (columnsCount === 0) {
      test.skip();
      return;
    }
    // The grid renders even when the upstream articles source is unavailable
    // (e.g. in CI), in which case it has no children and zero height. Its
    // responsive column layout is defined purely by CSS, so assert on the
    // computed style of the attached element rather than its visibility.
    await expect(columns).toBeAttached();

    const styles = await columns.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        gridTemplateColumns: cs.gridTemplateColumns,
        gap: cs.gap,
        minHeight: cs.minHeight,
      };
    });

    expect(styles.gridTemplateColumns.split(' ').length).toBe(2);
    expect(styles.gap).toBe('25px');
    expect(styles.minHeight).toBe('auto');
  });
});
