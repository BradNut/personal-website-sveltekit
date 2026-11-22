import type { Locator, Page } from '@playwright/test';

/** The computed colour a CSS custom property resolves to on `page`, e.g. `resolveColor(page, '--shellYellow')`. */
export function resolveColor(page: Page, variable: string): Promise<string> {
  return page.evaluate((v) => {
    const probe = document.createElement('div');
    probe.style.color = `var(${v})`;
    document.body.appendChild(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, variable);
}

/** The element's computed `background-color`. */
export function backgroundOf(locator: Locator): Promise<string> {
  return locator.evaluate((el) => getComputedStyle(el).backgroundColor);
}
