import * as Sentry from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit/hooks';
import { ENV } from 'varlock/env';
import { reportError } from '#lib/shared/errorReporter.ts';
import { dev } from '$app/env';

Sentry.init({
  release: `personal-website@${ENV.PUBLIC_SITE_VERSION}`,
  dsn: `${ENV.PUBLIC_SENTRY_URL}`,
  tracesSampleRate: 0.01,
  environment: dev ? 'development' : 'production',
  spotlight: true,
});

export const handleError: HandleClientError = async ({ error, event, kind }) =>
  // Kit 3 passes 4xx (app/framework) errors here too; their status lets reportError skip them.
  reportError({ error, event, status: kind === 'unknown' ? 500 : error.status, capture: Sentry.captureException });
