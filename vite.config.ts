import { sentrySvelteKit } from '@sentry/sveltekit/vite';
import adapter from '@sveltejs/adapter-node';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { varlockVitePlugin } from '@varlock/vite-integration';
import { defineConfig } from 'vitest/config';

export default defineConfig({
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
});
