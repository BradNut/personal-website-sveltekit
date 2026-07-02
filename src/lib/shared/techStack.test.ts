import { describe, expect, it } from 'vitest';
import { techStack } from './techStack';

describe('techStack', () => {
  it('has exactly 7 entries', () => {
    expect(techStack).toHaveLength(7);
  });

  it('every entry has a non-empty label', () => {
    for (const entry of techStack) {
      expect(entry.label.length).toBeGreaterThan(0);
    }
  });

  it('every entry has a valid https href', () => {
    for (const entry of techStack) {
      expect(entry.href).toMatch(/^https:\/\//);
    }
  });

  it('every entry has a non-empty iconPath string', () => {
    for (const entry of techStack) {
      expect(typeof entry.iconPath).toBe('string');
      expect(entry.iconPath.length).toBeGreaterThan(0);
    }
  });

  it('includes the expected labels', () => {
    const labels = techStack.map((e) => e.label);
    expect(labels).toContain('Svelte');
    expect(labels).toContain('Hono');
    expect(labels).toContain('TypeScript');
    expect(labels).toContain('Drizzle ORM');
    expect(labels).toContain('React');
    expect(labels).toContain('Next.js');
    expect(labels).toContain('Docker');
  });

  it('all labels are unique', () => {
    const labels = techStack.map((e) => e.label);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
