import * as Sentry from "@sentry/sveltekit";
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { dev } from "$app/environment";
import { SENTRY_BACKEND_URL, SITE_VERSION } from "$env/static/private";

Sentry.init({
  release: `personal-website@${SITE_VERSION}`,
  dsn: `${SENTRY_BACKEND_URL}`,
  tracesSampleRate: 0.01,
  environment: dev ? 'development' : 'production',
  sendDefaultPii: true,
});

export const handle: Handle = sequence(Sentry.sentryHandle());

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
  const errorId = crypto.randomUUID();
  console.log('error', error);

  Sentry.captureException(error, {
    extra: { event, errorId, status },
  });

  return {
    message: 'Whoops!',
    errorId,
  };
};