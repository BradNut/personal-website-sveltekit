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

import { GENERIC_ERROR_MESSAGE } from '$lib/shared/errorReporter';
import { handleError } from './hooks.client';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('client handleError', () => {
  it('delegates to the shared reporter with the browser-side error-tracking adapter', async () => {
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
    expect(result).toEqual({ message: GENERIC_ERROR_MESSAGE, errorId: expect.any(String) });
  });
});
