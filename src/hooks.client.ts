import * as Sentry from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';
import { ENV } from 'varlock/env';
import { dev } from '$app/environment';

Sentry.init({
  release: `personal-website@${ENV.PUBLIC_SITE_VERSION}`,
  dsn: `${ENV.PUBLIC_SENTRY_URL}`,
  tracesSampleRate: 0.01,
  environment: dev ? 'development' : 'production',
  sendDefaultPii: true,
  spotlight: true,
});

export const handleError: HandleClientError = async ({ error, event, status }) => {
  const errorId = crypto.randomUUID();

  // example integration with https://sentry.io/
  Sentry.captureException(error, {
    extra: { event, errorId, status },
  });

  return {
    message: 'Whoops!',
    errorId,
  };
};
