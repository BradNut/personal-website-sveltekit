import { ExternalLink as ExternalLinkIcon } from '@lucide/svelte';
import type { Snippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import type { ProjectLink } from '$lib/types/externalLinkType';
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

const svgSnippet = (() => {}) as unknown as Snippet;

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

describe('ExternalLink title attribute', () => {
  it('omits title when it matches the aria-label', () => {
    const props: ExternalLinkType & { iconSize?: number } = {
      linkData: {
        href: 'https://example.com',
        ariaLabel: 'Contact through LinkedIn',
        title: 'Open Contact through LinkedIn externally',
      },
      textData: { showIcon: true },
    };
    const { body } = render(ExternalLink, { props });
    expect(body).toContain('aria-label="Open Contact through LinkedIn externally"');
    expect(body).not.toContain('title=');
  });

  it('keeps title when it differs from the aria-label', () => {
    const props: ExternalLinkType & { iconSize?: number } = {
      linkData: {
        href: 'https://example.com',
        ariaLabel: 'Example',
        title: 'A different title',
      },
      textData: { showIcon: true },
    };
    const { body } = render(ExternalLink, { props });
    expect(body).toContain('title="A different title"');
  });
});

describe('ExternalLink with ProjectLink prop', () => {
  it('infers svg icon type when linkType is repo', () => {
    const projectLink: ProjectLink = {
      ariaLabel: 'GitHub repo',
      href: 'https://github.com/example/repo',
      icon: svgSnippet as unknown as Snippet,
      showIcon: true,
      text: 'GitHub repository',
      linkType: 'repo',
    };
    const { body } = render(ExternalLink, { props: { projectLink } as any });
    expect(body).toContain('<svg');
  });

  it('infers icon type when linkType is site', () => {
    const projectLink: ProjectLink = {
      ariaLabel: 'View live site',
      href: 'https://example.com',
      icon: ExternalLinkIcon,
      showIcon: true,
      text: 'View Site',
      linkType: 'site',
    };
    const { body } = render(ExternalLink, { props: { projectLink } as any });
    expect(body).toContain('lucide-icon');
    expect(body).not.toContain('viewBox="0 0 24 24" xmlns=');
  });

  it('renders default ExternalLink icon when no icon provided', () => {
    const projectLink: ProjectLink = {
      ariaLabel: 'Link',
      href: 'https://example.com',
      showIcon: true,
      text: 'Link',
    };
    const { body } = render(ExternalLink, { props: { projectLink } as any });
    expect(body).toContain('href="https://example.com"');
    expect(body).toContain('aria-label');
  });
});
