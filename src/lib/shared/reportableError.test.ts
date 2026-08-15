import { describe, expect, it } from 'vitest';

import { isReportableError } from './reportableError';

describe('isReportableError', () => {
  it('returns false for expected 4xx statuses', () => {
    expect(isReportableError({ status: 404, error: new Error('Not found') })).toBe(false);
    expect(isReportableError({ status: 429, error: new Error('Too many requests') })).toBe(false);
  });

  it('returns true for unexpected 5xx statuses', () => {
    expect(isReportableError({ status: 500, error: new Error('boom') })).toBe(true);
  });

  it('prefers an error status when it shows an expected 4xx error', () => {
    const error = Object.assign(new Error('Not found'), { status: 404 });

    expect(isReportableError({ status: 500, error })).toBe(false);
  });
});
