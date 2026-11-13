import * as Sentry from '@sentry/sveltekit';
import { type Handle, type HandleServerError, sequence } from '@sveltejs/kit/hooks';
import { ENV } from 'varlock/env';
import { StatusCodes } from '#lib/constants/status-codes.ts';
import { isProbeRequest } from '#lib/server/probeRequest.ts';
import { reportError } from '#lib/shared/errorReporter.ts';
import { dev } from '$app/env';

Sentry.init({
  release: `personal-website@${ENV.PUBLIC_SITE_VERSION}`,
  dsn: `${ENV.SENTRY_BACKEND_URL}`,
  tracesSampleRate: 0.01,
  environment: dev ? 'development' : 'production',
  spotlight: dev,
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

export const handleError: HandleServerError = async ({ error, event, kind }) =>
  // Kit 3 passes 4xx (app/framework) errors here too; their status lets reportError skip them.
  reportError({ error, event, status: kind === 'unknown' ? 500 : error.status, capture: Sentry.captureException });
