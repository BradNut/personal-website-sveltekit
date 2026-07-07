import { sentrySvelteKit } from '@sentry/sveltekit';
import adapter from '@sveltejs/adapter-node';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { varlockVitePlugin } from '@varlock/vite-integration';
import { imagetools } from '@zerodevx/svelte-img/vite';
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
      alias: {
        $: './src',
        $lib: './src/lib',
        '@': './src',
      },
      typescript: {
        config(config) {
          config.include.push('../env.d.ts');
        },
      },
      compilerOptions: {
        css: 'injected',
      },
      vitePlugin: {
        inspector: {
          toggleKeyCombo: 'control-alt-shift',
          showToggleButton: 'always',
          toggleButtonPos: 'bottom-right',
        },
      },
    }),
    imagetools({
      // By default, directives are `?width=480;1024;1920&format=avif;webp;jpg`
      // Now we change it to generate 5 variants instead - `avif/jpg` formats at `640/1280` + LQIP (Now as:run)
      profiles: {
        run: new URLSearchParams('?w=300;480;640;1024;1920&format=avif;webp;jpg&as=run:64'),
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
