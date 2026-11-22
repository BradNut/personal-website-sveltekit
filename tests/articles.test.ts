import { expect, test } from '@playwright/test';
import { ARTICLES_PER_PAGE, FAKE_WALLABAG } from './helpers/fake-wallabag/fixture.ts';

test.describe('Articles page', () => {
  test('mobile layout: columns grid is a single column and fits viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/articles/1');

    const columns = page.locator('.columns');
    await expect(columns.locator('article.card')).toHaveCount(ARTICLES_PER_PAGE);

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
    await expect(columns.locator('article.card')).toHaveCount(ARTICLES_PER_PAGE);

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

  test('the last page holds the remaining published articles and there is no page beyond it', async ({ page }) => {
    await page.goto(`/articles/${FAKE_WALLABAG.publishedPages}`);
    await expect(page.locator('.columns article.card')).toHaveCount(ARTICLES_PER_PAGE);
    await expect(page.locator('.top-pagination [data-pagination-page]').last()).toHaveText(`${FAKE_WALLABAG.publishedPages}`);
    await expect(page.locator('.top-pagination [data-pagination-next]')).toBeDisabled();
  });

  test('with more than seven pages the page list collapses around the current page', async ({ page }) => {
    // Bits UI only shows an ellipsis from 8 pages; the pagination layout tests need one to appear.
    expect(FAKE_WALLABAG.publishedPages).toBe(8);
    await page.goto('/articles/4');
    await expect(page.locator('.top-pagination [data-pagination-page]')).toHaveText(['1', '3', '4', '5', '8']);
    await expect(page.locator('.top-pagination .ellipsis')).toHaveCount(2);
  });

  test('entries Wallabag does not return for the programming tag are never published', async ({ page }) => {
    // These entries are the newest added, so they would lead page 1 if they were published
    expect(FAKE_WALLABAG.unpublishedTitles.length).toBeGreaterThan(0);
    await page.goto('/articles/1');
    await expect(page.locator('.columns article.card').first()).toBeVisible();
    for (const title of FAKE_WALLABAG.unpublishedTitles) {
      await expect(page.getByText(title)).toHaveCount(0);
    }
  });
});
