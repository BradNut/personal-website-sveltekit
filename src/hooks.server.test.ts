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

vi.mock('$app/env', () => ({
  dev: false,
}));

import { handleError } from './hooks.server';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('server handleError', () => {
  it('delegates to the shared reporter with the server-side error-tracking adapter', async () => {
    const error = new Error('boom');
    const event = { url: new URL('https://example.com') } as Parameters<typeof handleError>[0]['event'];

    const result = (await handleError({ kind: 'unknown', error, event })) as {
      message: string;
      errorId?: string;
    };

    expect(captureExceptionMock).toHaveBeenCalledOnce();
    expect(captureExceptionMock).toHaveBeenCalledWith(error, {
      extra: { event, errorId: result.errorId, status: 500 },
    });
    expect(result).toEqual({ message: 'Whoops!', errorId: expect.any(String) });
  });

  it('does not report framework 4xx errors such as missing routes', async () => {
    const event = { url: new URL('https://example.com/missing') } as Parameters<typeof handleError>[0]['event'];

    const result = await handleError({ kind: 'framework', error: { status: 404, message: 'Not Found' }, event });

    expect(captureExceptionMock).not.toHaveBeenCalled();
    expect(result).toEqual({ message: 'Whoops!' });
  });
});
