import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import TechStack from './TechStack.svelte';

describe('TechStack', () => {
  it('renders 7 links', () => {
    const { body } = render(TechStack, { props: {} });
    const matches = body.match(/<a\s/g);
    expect(matches).toHaveLength(7);
  });

  it('all links open in a new tab', () => {
    const { body } = render(TechStack, { props: {} });
    const targets = [...body.matchAll(/target="([^"]+)"/g)].map((m) => m[1]);
    expect(targets).toHaveLength(7);
    expect(targets.every((t) => t === '_blank')).toBe(true);
  });

  it('renders Svelte link with correct href and accessible name', () => {
    const { body } = render(TechStack, { props: {} });
    expect(body).toContain('href="https://svelte.dev"');
    expect(body).toContain('aria-label="Svelte"');
    expect(body).toContain('title="Svelte"');
  });

  it('renders Docker link with correct href and accessible name', () => {
    const { body } = render(TechStack, { props: {} });
    expect(body).toContain('href="https://www.docker.com/"');
    expect(body).toContain('aria-label="Docker"');
    expect(body).toContain('title="Docker"');
  });

  it('renders an SVG path per entry', () => {
    const { body } = render(TechStack, { props: {} });
    const paths = body.match(/<path\s/g);
    expect(paths).toHaveLength(7);
  });

  it('renders all 7 tech labels as visible text', () => {
    const { body } = render(TechStack, { props: {} });
    for (const label of ['Svelte', 'Hono', 'TypeScript', 'Drizzle ORM', 'React', 'Next.js', 'Docker']) {
      expect(body).toContain(label);
    }
  });
});
