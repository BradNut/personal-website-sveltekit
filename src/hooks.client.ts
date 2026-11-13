import * as Sentry from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit/hooks';
import { ENV } from 'varlock/env';
import { reportError } from '#lib/shared/errorReporter.ts';
import { dev } from '$app/env';

Sentry.init({
  release: `personal-website@${ENV.PUBLIC_SITE_VERSION}`,
  dsn: `${ENV.PUBLIC_SENTRY_URL}`,
  environment: dev ? 'development' : 'production',
  spotlight: dev,
  // Bugsink only needs the error; request/response bodies add size without helping debug.
  dataCollection: { httpBodies: [] },
});

export const handleError: HandleClientError = async ({ error, event, kind }) =>
  // Kit 3 passes 4xx (app/framework) errors here too; their status lets reportError skip them.
  reportError({ error, event, status: kind === 'unknown' ? 500 : error.status, capture: Sentry.captureException });
