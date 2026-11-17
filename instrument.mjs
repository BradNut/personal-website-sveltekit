import * as Sentry from '@sentry/node';
import 'varlock/auto-load';
import { ENV } from 'varlock/env';

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: ENV.SENTRY_BACKEND_URL,
  environment: ENV.ENVIRONMENT === 'production' ? 'production' : 'development',
  release: `personal-website@${ENV.SITE_VERSION}`,
  spotlight: ENV.ENVIRONMENT !== 'production',
  // Bugsink only needs the error; request/response bodies add size without helping debug.
  dataCollection: { httpBodies: [] },
});
