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

import { handleError, handleProbeRequest } from './hooks.server';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('handleProbeRequest', () => {
  it('short-circuits known Probe Requests with a plain generic 404 and skips route resolution', async () => {
    const resolve = vi.fn();

    const response = (await handleProbeRequest({
      event: { url: new URL('https://example.com/wp-login.php') } as Parameters<typeof handleProbeRequest>[0]['event'],
      resolve,
    })) as Response;

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(404);
    expect(resolve).not.toHaveBeenCalled();
  });

  it('passes ordinary Route Misses through to route resolution', async () => {
    const resolve = vi.fn(async () => new Response('normal 404', { status: 404 }));

    const response = await handleProbeRequest({
      event: {
        url: new URL('https://example.com/some-typo-page'),
      } as Parameters<typeof handleProbeRequest>[0]['event'],
      resolve,
    });

    expect(resolve).toHaveBeenCalledOnce();
    expect(response).toBeInstanceOf(Response);
  });
});

describe('server handleError', () => {
  it('delegates to the shared reporter with the server-side error-tracking adapter', async () => {
    const error = new Error('boom');
    const event = { url: new URL('https://example.com') } as Parameters<typeof handleError>[0]['event'];

    const result = (await handleError({ error, event, status: 500, message: 'boom' })) as {
      message: string;
      errorId?: string;
    };

    expect(captureExceptionMock).toHaveBeenCalledOnce();
    expect(captureExceptionMock).toHaveBeenCalledWith(error, {
      extra: { event, errorId: result.errorId, status: 500 },
    });
    expect(result).toEqual({ message: 'Whoops!', errorId: expect.any(String) });
  });
});
