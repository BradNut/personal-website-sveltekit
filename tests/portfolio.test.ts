import { expect, test } from '@playwright/test';
import { registerLayoutNavTests } from './helpers/layoutNavTests';

test.describe('Portfolio page', () => {
  test('has expected main heading', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page.getByRole('heading', { level: 1, name: 'Portfolio!' })).toBeVisible();
  });

  registerLayoutNavTests({ path: '/portfolio', activeLink: 'Portfolio', hoverLink: 'Uses' });

  test('tabs render and can switch between Personal and Professional', async ({ page }) => {
    await page.goto('/portfolio');

    // Prefer role-based tab selection; fall back to data attribute if role is not present
    const personalTab = page.getByRole('tab', { name: 'Personal' }).or(page.locator('[data-tabs-trigger]', { hasText: 'Personal' }));
    const professionalTab = page.getByRole('tab', { name: 'Professional' }).or(page.locator('[data-tabs-trigger]', { hasText: 'Professional' }));

    await expect(personalTab).toBeVisible();
    await expect(professionalTab).toBeVisible();

    // Personal content visible by default (card heading exists)
    const personalCardHeading = page.locator('.portfolio-picture h2', { hasText: 'Personal Website' }).first();
    await expect(personalCardHeading).toBeVisible();

    // Switch to Professional
    await professionalTab.click();

    // Professional content appears, personal may hide
    const professionalCardHeading = page.locator('.portfolio-picture h2', { hasText: 'Mark Shellnut Architect' }).first();
    await expect(professionalCardHeading).toBeVisible();
  });

  test('personal tab: key cards, images, and external links are accessible', async ({ page }) => {
    await page.goto('/portfolio');

    // Ensure on Personal tab
    const personalTab = page.getByRole('tab', { name: 'Personal' }).or(page.locator('[data-tabs-trigger]', { hasText: 'Personal' }));
    await personalTab.click();

    // Headings (scoped to portfolio cards to avoid strict-mode conflicts)
    await expect(page.locator('.portfolio-picture h2', { hasText: 'Personal Website' }).first()).toBeVisible();
    await expect(page.locator('.portfolio-picture h2', { hasText: 'Wedding Website' }).first()).toBeVisible();
    await expect(page.locator('.portfolio-picture h2', { hasText: 'Old Personal Website' }).first()).toBeVisible();

    // Images by alt text
    await expect(page.getByAltText("Picture of Bradley Shellnut's Personal Website")).toBeVisible();
    await expect(page.getByAltText('Picture of NextJS Wedding Website')).toBeVisible();
    await expect(page.getByAltText('Home Page of the old bradleyshellnut.com website')).toBeVisible();

    // External links (use visible link names)
    await expect(page.getByRole('link', { name: /GitHub repository/i }).first()).toBeVisible();
  });

  test('professional tab: card renders with external link', async ({ page }) => {
    await page.goto('/portfolio');

    const professionalTab = page.getByRole('tab', { name: 'Professional' }).or(page.locator('[data-tabs-trigger]', { hasText: 'Professional' }));
    await professionalTab.click();

    const professionalCard = page
      .locator('.portfolio')
      .filter({ has: page.locator('.portfolio-picture h2', { hasText: 'Mark Shellnut Architect' }) })
      .first();

    await expect(professionalCard).toBeVisible();
    // Accessible name derived from aria-label in ExternalLink.svelte
    await expect(professionalCard.getByRole('link', { name: /Open\s+View Mark Shellnut Architect\s+externally/i })).toBeVisible();
  });
});
