import { sentrySvelteKit } from '@sentry/sveltekit';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from '@zerodevx/svelte-img/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sentrySvelteKit(),
    enhancedImages(),
    sveltekit(),
    imagetools({
      // By default, directives are `?width=480;1024;1920&format=avif;webp;jpg`
      // Now we change it to generate 5 variants instead - `avif/jpg` formats at `640/1280` + LQIP (Now as:run)
      profiles: {
        run: new URLSearchParams('?w=300;480;640;1024;1920&format=avif;webp;jpg&as=run:64'),
      },
    }),
  ],
  esbuild: {
    target: 'es2022',
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    mockReset: true,
  },
  css: {
    devSourcemap: true,
  },
});
