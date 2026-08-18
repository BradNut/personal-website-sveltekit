import { describe, expect, it, vi } from 'vitest';

import { reportError } from './errorReporter';

const event = { url: new URL('https://example.com/missing') };

describe('reportError', () => {
  it('stays silent for expected 4xx errors', () => {
    const capture = vi.fn();

    const result = reportError({ error: new Error('Not found'), event, status: 404, capture });

    expect(capture).not.toHaveBeenCalled();
    expect(result).toEqual({ message: 'Whoops!' });
  });

  it('captures unexpected 5xx errors and returns an error id', () => {
    const capture = vi.fn();
    const error = new Error('boom');

    const result = reportError({ error, event, status: 500, capture });

    expect(capture).toHaveBeenCalledOnce();
    expect(capture).toHaveBeenCalledWith(error, { extra: { event, errorId: result.errorId, status: 500 } });
    expect(result.message).toBe('Whoops!');
    expect(result.errorId).toEqual(expect.any(String));
  });

  it('stays silent when the error carries an expected 4xx status and the passed status says 5xx', () => {
    const capture = vi.fn();
    const error = Object.assign(new Error('Not found'), { status: 404 });

    const result = reportError({ error, event, status: 500, capture });

    expect(capture).not.toHaveBeenCalled();
    expect(result).toEqual({ message: 'Whoops!' });
  });

  it('mints a fresh error id for each reportable error', () => {
    const capture = vi.fn();

    const first = reportError({ error: new Error('boom'), event, status: 500, capture });
    const second = reportError({ error: new Error('boom'), event, status: 500, capture });

    expect(first.errorId).not.toBe(second.errorId);
  });

  it('treats sub-400 statuses as reportable', () => {
    const capture = vi.fn();

    const result = reportError({ error: new Error('unexpected success'), event, status: 200, capture });

    expect(capture).toHaveBeenCalledOnce();
    expect(result.errorId).toEqual(expect.any(String));
  });

  it('reports a null or undefined error', () => {
    const capture = vi.fn();

    expect(reportError({ error: null, event, status: 500, capture }).errorId).toEqual(expect.any(String));
    expect(reportError({ error: undefined, event, status: 500, capture }).errorId).toEqual(expect.any(String));
    expect(capture).toHaveBeenCalledTimes(2);
  });

  it('reports a value that is not an Error instance', () => {
    const capture = vi.fn();

    const result = reportError({ error: 'just a string', event, status: 500, capture });

    expect(capture).toHaveBeenCalledWith('just a string', {
      extra: { event, errorId: result.errorId, status: 500 },
    });
  });

  it('falls back to the passed status when the error carries a non-numeric status', () => {
    const capture = vi.fn();
    const error = Object.assign(new Error('Not found'), { status: '404' });

    const reportable = reportError({ error, event, status: 500, capture });
    const silent = reportError({ error, event, status: 404, capture });

    expect(reportable.errorId).toEqual(expect.any(String));
    expect(silent).toEqual({ message: 'Whoops!' });
    expect(capture).toHaveBeenCalledOnce();
  });

  it('still returns the visitor-facing result when the capture adapter throws', () => {
    const capture = vi.fn(() => {
      throw new Error('tracking outage');
    });

    const result = reportError({ error: new Error('boom'), event, status: 500, capture });

    expect(result.message).toBe('Whoops!');
    expect(result.errorId).toEqual(expect.any(String));
  });
});
