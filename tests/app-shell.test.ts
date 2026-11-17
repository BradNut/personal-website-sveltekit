import { expect, test } from '@playwright/test';

test.describe('App shell', () => {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`a fresh ${colorScheme}-mode visit sets no theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('/');

      await expect(page.locator('html')).not.toHaveAttribute('data-theme');
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
    });
  }
});
