import * as Sentry from '@sentry/sveltekit';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { ENV } from 'varlock/env';
import { dev } from '$app/environment';
import { StatusCodes } from '$lib/constants/status-codes';
import { isProbeRequest } from '$lib/server/probeRequest';
import { isReportableError } from '$lib/shared/reportableError';

Sentry.init({
  release: `personal-website@${ENV.PUBLIC_SITE_VERSION}`,
  dsn: `${ENV.SENTRY_BACKEND_URL}`,
  tracesSampleRate: 0.01,
  environment: dev ? 'development' : 'production',
  sendDefaultPii: true,
  spotlight: true,
});

export const handleProbeRequest: Handle = async ({ event, resolve }) => {
  if (!isProbeRequest(event.url.pathname)) {
    return resolve(event);
  }

  if (dev) {
    console.debug(`Suppressed Probe Request: ${event.url.pathname}`);
  }

  return new Response('Not Found', { status: StatusCodes.NOT_FOUND });
};

export const handle: Handle = sequence(handleProbeRequest, Sentry.sentryHandle());

export const handleError: HandleServerError = async ({ error, event, status }) => {
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
