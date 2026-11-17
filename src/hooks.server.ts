import * as Sentry from '@sentry/sveltekit';
import { type Handle, type HandleServerError, sequence } from '@sveltejs/kit/hooks';
import { ENV } from 'varlock/env';
import { handleProbeRequest } from '#lib/server/probe-request.ts';
import { reportError } from '#lib/shared/error-reporter.ts';
import { dev } from '$app/env';

Sentry.init({
  release: `personal-website@${ENV.PUBLIC_SITE_VERSION}`,
  dsn: `${ENV.SENTRY_BACKEND_URL}`,
  environment: dev ? 'development' : 'production',
  spotlight: dev,
  // Bugsink only needs the error; request/response bodies add size without helping debug.
  dataCollection: { httpBodies: [] },
});

export const handle: Handle = sequence(handleProbeRequest, Sentry.sentryHandle());

export const handleError: HandleServerError = async ({ error, event, kind }) =>
  // Kit 3 passes 4xx (app/framework) errors here too; their status lets reportError skip them.
  reportError({ error, event, status: kind === 'unknown' ? 500 : error.status, capture: Sentry.captureException });
