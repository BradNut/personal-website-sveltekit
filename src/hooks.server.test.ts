import { beforeEach, describe, expect, it, vi } from 'vitest';

const { captureExceptionMock, initMock, sentryHandleMock } = vi.hoisted(() => ({
  captureExceptionMock: vi.fn(),
  initMock: vi.fn(),
  sentryHandleMock: vi.fn(() => vi.fn()),
}));

vi.mock('@sentry/sveltekit', () => ({
  init: initMock,
  captureException: captureExceptionMock,
  sentryHandle: sentryHandleMock,
}));

vi.mock('varlock/env', () => ({
  initVarlockEnv: vi.fn(),
  ENV: {
    PUBLIC_SITE_VERSION: 'test-version',
    SENTRY_BACKEND_URL: 'https://example.com/server-dsn',
  },
}));

vi.mock('$app/environment', () => ({
  dev: false,
}));

import { handleError } from './hooks.server';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('server handleError', () => {
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
