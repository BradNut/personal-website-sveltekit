import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Logo from './index.svelte';

describe('Logo', () => {
  it('renders a single home link', () => {
    const { body } = render(Logo, { props: {} });
    const links = body.match(/<a\s/g) ?? [];
    expect(links).toHaveLength(1);
    expect(body).toContain('href="/"');
  });

  it('uses visible text as the accessible link name', () => {
    const { body } = render(Logo, { props: {} });
    expect(body).toContain('Bradley');
    expect(body).toContain('Shell');
    expect(body).toContain('Nut');
  });

  it('marks logo images as decorative', () => {
    const { body } = render(Logo, { props: {} });
    expect(body).toContain('alt=""');
    expect(body).not.toContain('alt="Bee');
    expect(body).not.toContain('alt="Shell');
    expect(body).not.toContain('alt="Nut');
  });
});
