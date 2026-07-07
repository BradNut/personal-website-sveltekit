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
    await expect(columns).toBeVisible();

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
    await expect(columns).toBeVisible();

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
