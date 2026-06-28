import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Tag from './Tag.svelte';

describe('Tag', () => {
  it('renders the tag name inside a badge', () => {
    const { body } = render(Tag, { props: { name: 'Svelte' } });
    expect(body).toContain('Svelte');
    expect(body).toContain('badge-default');
    expect(body).toContain('<span');
  });
});
