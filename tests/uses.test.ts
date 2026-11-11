import { expect, test } from '@playwright/test';
import { registerLayoutNavTests } from './helpers/layoutNavTests';

test.describe('Uses page', () => {
  test('has expected main heading', async ({ page }) => {
    await page.goto('/uses');
    await expect(page.getByRole('heading', { level: 1, name: '/Uses' })).toBeVisible();
  });

  registerLayoutNavTests({ path: '/uses', activeLink: 'Uses', hoverLink: 'Uses' });

  test('hero image visible with correct alt text', async ({ page }) => {
    await page.goto('/uses');
    await expect(page.getByAltText('Clean desk with Samsung monitor and Ducky Keyboard')).toBeVisible();
  });

  test('intro external links are accessible by aria-label-based names', async ({ page }) => {
    await page.goto('/uses');

    // ExternalLink.svelte sets accessible name as: "Open {ariaLabel|title|href} externally"
    await expect(page.getByRole('link', { name: /Open\s+Wes Bos' Website\s+externally/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Open\s+Wes Bos' Uses Page\s+externally/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Open\s+Uses\.tech\s+externally/i })).toBeVisible();
  });

  test('uses page sections are accordion triggers', async ({ page }) => {
    await page.goto('/uses');

    const sections = ['Hardware & Accessories', 'Development', 'Privacy Hardware and Software'];

    for (const name of sections) {
      await expect(page.getByRole('button', { name, exact: true })).toBeVisible();
    }
  });

  test('accordion sections can be toggled', async ({ page }) => {
    await page.goto('/uses');

    const devTrigger = page.getByRole('button', { name: 'Development', exact: true });
    const devContent = page.locator('.uses-content').filter({ has: page.locator('#uses-development') });

    // Open by default.
    await expect(devTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(devContent).toHaveAttribute('data-state', 'open');
    await expect(page.locator('section#uses-development')).toBeVisible();

    // Collapse. The content uses `hidden="until-found"` (content-visibility: hidden),
    // which WebKit still reports as a laid-out box for descendants. Assert the
    // accordion's ARIA/data state rather than pixel visibility so the toggle
    // behaviour is verified consistently across engines.
    await devTrigger.click();
    await expect(devTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(devContent).toHaveAttribute('data-state', 'closed');

    // Expand again.
    await devTrigger.click();
    await expect(devTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(devContent).toHaveAttribute('data-state', 'open');
  });

  test('sections and subsections render', async ({ page }) => {
    await page.goto('/uses');

    await expect(page.getByRole('heading', { level: 2, name: 'Development' })).toBeVisible();

    // h3 subsections in development.svelte
    const subsections = ['Terminal & Shell Setup', 'Useful System Packages', 'Software', 'Useful Applications', 'Browsers'];
    for (const name of subsections) {
      await expect(page.getByRole('heading', { level: 3, name })).toBeVisible();
    }
  });

  test('a few key external links in Development section are present', async ({ page }) => {
    await page.goto('/uses');

    // Select within the Development section to be robust
    const devSection = page.locator('section#uses-development');
    await expect(devSection).toBeVisible();

    const expectedLinks = [
      /Open\s+Bradley Shellnut Computer Setup\s+externally/i,
      /Open\s+Dotfiles\s+externally/i,
      /Open\s+Ghostty\s+externally/i,
      /Open\s+Starship\s+externally/i,
      /Open\s+ZimFW\s+externally/i,
      /Open\s+Linux Brew\s+externally/i,
      /Open\s+Homebrew\s+externally/i,
      /Open\s+TLDR Man Pages\s+externally/i,
      /Open\s+Trash-CLI\s+externally/i,
      /Open\s+VSCodium\s+externally/i,
      /Open\s+VS Code Extensions\s+externally/i,
      /Open\s+Sublime Text\s+externally/i,
      /Open\s+Sublime Text Extensions\s+externally/i,
      /Open\s+IntelliJ IDEA\s+externally/i,
      /Open\s+IntelliJ Plugins\s+externally/i,
      /Open\s+Bruno\s+externally/i,
      /Open\s+Brave Browser\s+externally/i,
      /Open\s+Firefox\s+externally/i,
    ];

    for (const pattern of expectedLinks) {
      await expect(devSection.getByRole('link', { name: pattern })).toBeVisible();
    }
  });
});
