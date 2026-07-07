import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Badge from './Badge.svelte';

const testSnippet = createRawSnippet(() => ({
  render: () => 'Test badge',
}));

function renderBadge(props: Record<string, unknown> = {}) {
  const { body } = render(Badge, {
    props: {
      ...props,
      children: testSnippet,
    },
  });
  return body;
}

describe('Badge', () => {
  it('renders as a span by default', () => {
    const html = renderBadge();
    expect(html).toContain('<span');
    expect(html).toContain('Test badge');
    expect(html).not.toContain('<a');
  });

  it('renders as a link when href is provided', () => {
    const html = renderBadge({ href: '/articles' });
    expect(html).toContain('<a');
    expect(html).toContain('href="/articles"');
    expect(html).not.toContain('<span');
  });

  it('applies default variant classes', () => {
    const html = renderBadge();
    expect(html).toContain('badge-default');
  });

  it('applies secondary variant classes', () => {
    const html = renderBadge({ variant: 'secondary' });
    expect(html).toContain('badge-secondary');
  });

  it('applies outline variant classes', () => {
    const html = renderBadge({ variant: 'outline' });
    expect(html).toContain('badge-outline');
  });

  it('applies destructive variant classes', () => {
    const html = renderBadge({ variant: 'destructive' });
    expect(html).toContain('badge-destructive');
  });

  it('forwards additional class names', () => {
    const html = renderBadge({ class: 'extra-class' });
    expect(html).toContain('extra-class');
  });
});
