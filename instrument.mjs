import * as Sentry from '@sentry/node';
import 'varlock/auto-load';
import { ENV } from 'varlock/env';

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: ENV.SENTRY_BACKEND_URL,
  environment: ENV.ENVIRONMENT === 'production' ? 'production' : 'development',
  tracesSampleRate: 0,
  sendDefaultPii: true,
  release: `personal-website@${ENV.SITE_VERSION}`,
  spotlight: true
});
