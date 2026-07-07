import { describe, expect, it, vi } from 'vitest';

vi.mock('./$types', () => ({}));

import { load } from './+page.server.js';

function makeLoadArgs(originUrl = 'http://localhost') {
  const url = new URL('/portfolio', originUrl);
  return {
    url,
    request: new Request(url),
    route: { id: '/portfolio' },
    params: {},
    isDataRequest: false,
    isSubRequest: false,
  } as unknown as Parameters<typeof load>[0];
}

describe('portfolio load', () => {
  it('returns projects array', async () => {
    const result = (await load(makeLoadArgs())) as Record<string, unknown>;
    expect(Array.isArray(result.projects)).toBe(true);
  });

  it('projects array is non-empty', async () => {
    const result = (await load(makeLoadArgs())) as Record<string, unknown>;
    const projects = result.projects as unknown[];
    expect(projects.length).toBeGreaterThan(0);
  });

  it('includes personal and professional projects', async () => {
    const result = (await load(makeLoadArgs())) as Record<string, unknown>;
    const projects = result.projects as Array<{ category: string }>;
    const categories = projects.map((p) => p.category);
    expect(categories).toContain('personal');
    expect(categories).toContain('professional');
  });

  it('still returns metaTagsChild', async () => {
    const result = (await load(makeLoadArgs())) as Record<string, unknown>;
    expect(result.metaTagsChild).toBeDefined();
  });
});
