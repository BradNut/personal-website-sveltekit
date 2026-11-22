import type { PlaywrightTestConfig } from '@playwright/test';
import { ARTICLES_PER_PAGE, FAKE_WALLABAG } from './tests/helpers/fake-wallabag/fixture.ts';

const config: PlaywrightTestConfig = {
  webServer: [
    {
      command: `node tests/helpers/fake-wallabag/server.mjs ${FAKE_WALLABAG.port}`,
      url: `${FAKE_WALLABAG.url}/healthz`,
      reuseExistingServer: false,
    },
    {
      command: 'pnpm -s exec svelte-kit sync && pnpm run build && pnpm run preview',
      port: 4173,
      timeout: 180_000,
      // Never reuse a running server: it could be reading real Wallabag data instead of the fake.
      reuseExistingServer: false,
      // Overrides any shell or CI value, so e2e always reads the fake Wallabag's fixture with Redis off.
      // Every other value varlock requires is a fake, non-secret one (as in CI), so a plain local run needs no vault.
      env: {
        ENVIRONMENT: 'test',
        BANDCAMP_USERNAME: 'test-user',
        PUBLIC_SITE_URL: 'https://example.test',
        PUBLIC_URL: 'https://localhost:5173',
        PUBLIC_SENTRY_URL: 'https://sentry.test',
        PUBLIC_UMAMI_URL: 'https://umami.test/script.js',
        PUBLIC_UMAMI_ID: 'test-umami-id',
        REDIS_URI: 'redis://localhost:6379',
        SENTRY_AUTH_TOKEN: 'test-sentry-token',
        SENTRY_BACKEND_URL: 'https://sentry-backend.test',
        WALLABAG_URL: FAKE_WALLABAG.url,
        WALLABAG_CLIENT_ID: 'fake-client-id',
        WALLABAG_CLIENT_SECRET: 'fake-client-secret',
        WALLABAG_USERNAME: 'fake-user',
        WALLABAG_PASSWORD: 'fake-password',
        PAGE_SIZE: `${ARTICLES_PER_PAGE}`,
        USE_REDIS_CACHE: 'false',
      },
    },
  ],
  testDir: 'tests',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  use: {
    baseURL: 'http://localhost:4173',
  },
  reporter: 'html',
  // Run on main browsers: Chromium (Chrome), Firefox, WebKit (Safari)
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
};

export default config;
