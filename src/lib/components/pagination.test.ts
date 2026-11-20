import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Pagination from './pagination.svelte';

function renderPagination(currentPage: number, totalCount = 50) {
  const { body } = render(Pagination, {
    props: {
      additionalClasses: 'top-pagination',
      pageSize: 10,
      totalCount,
      currentPage,
      totalPages: Math.ceil(totalCount / 10),
      base: '/articles',
    },
  });
  return body;
}

function pageButton(html: string, page: number) {
  const match = html.match(new RegExp(`<button[^>]*aria-label="Go to page ${page}"[^>]*>`));
  expect(match, `page ${page} button`).not.toBeNull();
  return match?.[0] ?? '';
}

describe('Pagination', () => {
  it('marks the current page with aria-current="page"', () => {
    const html = renderPagination(2);
    expect(pageButton(html, 2)).toContain('aria-current="page"');
  });

  it('does not mark other pages as current', () => {
    const html = renderPagination(2);
    expect(pageButton(html, 1)).not.toContain('aria-current');
    expect(pageButton(html, 3)).not.toContain('aria-current');
  });

  it('treats a missing current page as page 1', () => {
    const html = renderPagination(0);
    expect(pageButton(html, 1)).toContain('aria-current="page"');
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
  });
});
