import { describe, expect, it } from 'vitest';
import { portfolioProjects } from './portfolioProjects.js';

describe('portfolioProjects', () => {
  it('exports an array with at least one project', () => {
    expect(Array.isArray(portfolioProjects)).toBe(true);
    expect(portfolioProjects.length).toBeGreaterThan(0);
  });

  it('every project has a non-empty name', () => {
    for (const project of portfolioProjects) {
      expect(typeof project.name).toBe('string');
      expect(project.name.length).toBeGreaterThan(0);
    }
  });

  it('every project has a category of "personal" or "professional"', () => {
    for (const project of portfolioProjects) {
      expect(['personal', 'professional']).toContain(project.category);
    }
  });

  it('every project has a non-empty imageKey string', () => {
    for (const project of portfolioProjects) {
      expect(typeof project.imageKey).toBe('string');
      expect(project.imageKey.length).toBeGreaterThan(0);
    }
  });

  it('every project has a non-empty externalLinks array', () => {
    for (const project of portfolioProjects) {
      expect(Array.isArray(project.externalLinks)).toBe(true);
      expect(project.externalLinks.length).toBeGreaterThan(0);
    }
  });

  it('every externalLink has required fields', () => {
    for (const project of portfolioProjects) {
      for (const link of project.externalLinks) {
        expect(typeof link.ariaLabel).toBe('string');
        expect(link.ariaLabel.length).toBeGreaterThan(0);
        expect(link.href).toMatch(/^https?:\/\//);
        expect(typeof link.text).toBe('string');
        expect(link.text.length).toBeGreaterThan(0);
        expect(typeof link.showIcon).toBe('boolean');
      }
    }
  });

  it('every project has a non-empty techStack array', () => {
    for (const project of portfolioProjects) {
      expect(Array.isArray(project.techStack)).toBe(true);
      expect(project.techStack.length).toBeGreaterThan(0);
    }
  });

  it('every techStack item has a non-empty label', () => {
    for (const project of portfolioProjects) {
      for (const item of project.techStack) {
        expect(typeof item.label).toBe('string');
        expect(item.label.length).toBeGreaterThan(0);
      }
    }
  });

  it('techStack hrefs when present are valid https URLs', () => {
    for (const project of portfolioProjects) {
      for (const item of project.techStack) {
        if (item.href !== undefined) {
          expect(item.href).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it('every project has a non-empty description array', () => {
    for (const project of portfolioProjects) {
      expect(Array.isArray(project.description)).toBe(true);
      expect(project.description.length).toBeGreaterThan(0);
    }
  });

  it('includes the four known projects', () => {
    const names = portfolioProjects.map((p) => p.name);
    expect(names).toContain('Personal Website');
    expect(names).toContain('Wedding Website');
    expect(names).toContain('Old Personal Website');
    expect(names).toContain('Mark Shellnut Architect');
  });

  it('has personal and professional projects', () => {
    const categories = portfolioProjects.map((p) => p.category);
    expect(categories).toContain('personal');
    expect(categories).toContain('professional');
  });

  it('all imageKeys are unique', () => {
    const keys = portfolioProjects.map((p) => p.imageKey);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
