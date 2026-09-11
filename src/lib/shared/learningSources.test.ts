import { describe, expect, it } from 'vitest';
import { learningSources } from './learningSources';

describe('learningSources', () => {
  it('exposes at least one source', () => {
    expect(learningSources.length).toBeGreaterThan(0);
  });

  it('gives every source a non-empty name', () => {
    for (const source of learningSources) {
      expect(source.name.trim()).not.toBe('');
    }
  });

  it('gives every source a secure absolute primary link', () => {
    for (const source of learningSources) {
      expect(() => new URL(source.href)).not.toThrow();
      expect(new URL(source.href).protocol).toBe('https:');
    }
  });

  it('gives every source at least one subject', () => {
    for (const source of learningSources) {
      expect(source.subjects.length).toBeGreaterThan(0);
    }
  });

  it('has no empty or duplicated subjects within a source', () => {
    for (const source of learningSources) {
      for (const subject of source.subjects) {
        expect(subject.trim()).not.toBe('');
      }
      expect(new Set(source.subjects).size).toBe(source.subjects.length);
    }
  });

  it('names each source uniquely', () => {
    const names = learningSources.map((source) => source.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('gives every notable work both a label and a secure absolute link', () => {
    for (const source of learningSources) {
      const work = source.notableWork;
      if (!work) continue;
      expect(work.text.trim()).not.toBe('');
      expect(() => new URL(work.href)).not.toThrow();
      expect(new URL(work.href).protocol).toBe('https:');
    }
  });

  it('never points a notable work at the same URL as its source', () => {
    for (const source of learningSources) {
      if (!source.notableWork) continue;
      expect(source.notableWork.href).not.toBe(source.href);
    }
  });
});
