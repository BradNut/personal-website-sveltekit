import * as Sentry from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';
import { ENV } from 'varlock/env';
import { dev } from '$app/environment';
import { isReportableError } from '$lib/shared/reportableError';

Sentry.init({
  release: `personal-website@${ENV.PUBLIC_SITE_VERSION}`,
  dsn: `${ENV.PUBLIC_SENTRY_URL}`,
  tracesSampleRate: 0.01,
  environment: dev ? 'development' : 'production',
  sendDefaultPii: true,
  spotlight: true,
});

export const handleError: HandleClientError = async ({ error, event, status }) => {
  if (!isReportableError({ error, status })) {
    return {
      message: 'Whoops!',
    };
  }

  const errorId = crypto.randomUUID();

  Sentry.captureException(error, {
    extra: { event, errorId, status },
  });

  return {
    message: 'Whoops!',
    errorId,
  };
};
