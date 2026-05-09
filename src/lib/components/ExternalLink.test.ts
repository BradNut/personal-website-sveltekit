import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import type { ExternalLinkType } from '$lib/types/externalLinkTypes';
import ExternalLink from './ExternalLink.svelte';

function renderWithLocation(location?: 'top' | 'bottom' | 'left' | 'right') {
  const props: ExternalLinkType & { iconSize?: number } = {
    linkData: { href: 'https://example.com', ariaLabel: 'Test' },
    textData: { showIcon: false, text: 'Link', location },
  };
  const { body } = render(ExternalLink, { props });
  return body;
}

describe('ExternalLink textLocationClass', () => {
  it('applies text-top class for top location', () => {
    const html = renderWithLocation('top');
    expect(html).toContain('text-top');
  });

  it('applies text-bottom class for bottom location', () => {
    const html = renderWithLocation('bottom');
    expect(html).toContain('text-bottom');
  });

  it('applies text-left class for left location', () => {
    const html = renderWithLocation('left');
    expect(html).toContain('text-left');
  });

  it('applies text-right class for right location', () => {
    const html = renderWithLocation('right');
    expect(html).toContain('text-right');
  });

  it('defaults to text-left when no location provided', () => {
    const html = renderWithLocation();
    expect(html).toContain('text-left');
  });
});
