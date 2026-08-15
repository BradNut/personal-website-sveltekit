import { beforeEach, describe, expect, it, vi } from 'vitest';

const { captureExceptionMock, initMock } = vi.hoisted(() => ({
  captureExceptionMock: vi.fn(),
  initMock: vi.fn(),
}));

vi.mock('@sentry/sveltekit', () => ({
  init: initMock,
  captureException: captureExceptionMock,
}));

vi.mock('varlock/env', () => ({
  initVarlockEnv: vi.fn(),
  ENV: {
    PUBLIC_SITE_VERSION: 'test-version',
    PUBLIC_SENTRY_URL: 'https://example.com/client-dsn',
  },
}));

vi.mock('$app/environment', () => ({
  dev: false,
}));

import { handleError } from './hooks.client';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('client handleError', () => {
  it('does not report expected 4xx errors', async () => {
    const result = (await handleError({
      error: new Error('Not found'),
      event: { url: new URL('https://example.com/missing') } as Parameters<typeof handleError>[0]['event'],
      status: 404,
      message: 'Not found',
    })) as { message: string; errorId?: string };

    expect(captureExceptionMock).not.toHaveBeenCalled();
    expect(result).toEqual({ message: 'Whoops!' });
  });

  it('does not report expected 4xx errors when the error carries the real status', async () => {
    const error = Object.assign(new Error('Not found'), { status: 404 });

    const result = (await handleError({
      error,
      event: { url: new URL('https://example.com/missing') } as Parameters<typeof handleError>[0]['event'],
      status: 500,
      message: 'Not found',
    })) as { message: string; errorId?: string };

    expect(captureExceptionMock).not.toHaveBeenCalled();
    expect(result).toEqual({ message: 'Whoops!' });
  });

  it('reports unexpected 5xx errors with an error id', async () => {
    const result = (await handleError({
      error: new Error('boom'),
      event: { url: new URL('https://example.com') } as Parameters<typeof handleError>[0]['event'],
      status: 500,
      message: 'boom',
    })) as { message: string; errorId?: string };

    expect(captureExceptionMock).toHaveBeenCalledOnce();
    expect(captureExceptionMock.mock.calls[0]?.[0]).toBeInstanceOf(Error);
    expect(captureExceptionMock.mock.calls[0]?.[1]).toMatchObject({ extra: { status: 500 } });
    expect(result.message).toBe('Whoops!');
    expect(result.errorId).toEqual(expect.any(String));
  });
});
