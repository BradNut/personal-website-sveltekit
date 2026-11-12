import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { retryWithBackoff } from './retry';

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('retryWithBackoff', () => {
  it('retries until the function succeeds', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('flaky')).mockResolvedValueOnce('ok');

    const promise = retryWithBackoff(fn);
    await vi.runAllTimersAsync();

    await expect(promise).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('logs the underlying error on each failed attempt', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new TypeError('fetch failed')).mockResolvedValueOnce('ok');

    const promise = retryWithBackoff(fn);
    await vi.runAllTimersAsync();
    await promise;

    expect(console.log).toHaveBeenCalledWith('Attempt 1 failed (TypeError: fetch failed), retrying in 500ms...');
  });

  it('rethrows immediately when shouldRetry returns false', async () => {
    const error = new Error('bad credentials');
    const fn = vi.fn().mockRejectedValue(error);

    await expect(retryWithBackoff(fn, 3, 500, { shouldRetry: () => false })).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('gives up after maxRetries and rethrows the last error', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('down'));

    const promise = retryWithBackoff(fn, 2, 100);
    const assertion = expect(promise).rejects.toThrow('down');
    await vi.runAllTimersAsync();
    await assertion;

    expect(fn).toHaveBeenCalledTimes(3);
  });
});
