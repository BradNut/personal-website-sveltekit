import * as Sentry from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { PUBLIC_SENTRY_URL, PUBLIC_SITE_VERSION } from '$env/static/public';

Sentry.init({
  release: `personal-website@${PUBLIC_SITE_VERSION}`,
  dsn: `${PUBLIC_SENTRY_URL}`,
  tracesSampleRate: 0.01,
  environment: dev ? 'development' : 'production',
  sendDefaultPii: true,
});

export const handleError: HandleClientError = async ({ error, event, status, message }) => {
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
