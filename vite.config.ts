import { sentrySvelteKit } from '@sentry/sveltekit/vite';
import adapter from '@sveltejs/adapter-node';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { varlockVitePlugin } from '@varlock/vite-integration';
import { defineConfig } from 'vitest/config';
import { createCspDirectives } from './src/lib/constants/csp-directives.ts';

export default defineConfig(({ command }) => ({
  plugins: [
    sentrySvelteKit({
      telemetry: false,
    }),
    enhancedImages(),
    varlockVitePlugin(),
    sveltekit({
      adapter: adapter(),
      compilerOptions: {
        css: 'injected',
        // Lets the async client `handleError` hook be awaited during rendering.
        experimental: { async: true },
      },
      csp: {
        // Hashes, not nonces, so pages can revalidate: see the CSP section of .knowledge-base/runbooks/infrastructure.md
        mode: 'hash',
        // Report-only while the allow-list is proven in production; #129 switches it to `directives`.
        // The varlock plugin has loaded the env into process.env by the time this config is evaluated.
        reportOnly: createCspDirectives({
          umamiUrl: process.env.PUBLIC_UMAMI_URL,
          sentryDsn: process.env.PUBLIC_SENTRY_URL,
          development: command === 'serve',
        }),
      },
      inspector: {
        toggleKeyCombo: 'control-alt-shift',
        showToggleButton: 'always',
        toggleButtonPos: 'bottom-right',
      },
    }),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    mockReset: true,
  },
  css: {
    devSourcemap: true,
  },
}));
