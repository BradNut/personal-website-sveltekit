import * as Sentry from '@sentry/node';

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: process.env.SENTRY_BACKEND_URL,
  environment: process.env.ENVIRONMENT === 'production' ? 'production' : 'development',
  tracesSampleRate: 0,
  sendDefaultPii: true,
  release: `secondchancepuzzles@${process.env.SITE_VERSION}`,
});
