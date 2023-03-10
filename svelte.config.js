import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import relativeImages from 'mdsvex-relative-images';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	preprocess: [vitePreprocess(),mdsvex(mdsvexConfig)],
	kit: {
		adapter: adapter(),
		alias: {
			$root: './src'
		}
	},
	vitePlugin: {
		experimental: {
			inspector: {
				toggleKeyCombo: 'control-alt-shift'
			}
		}
	}
};

export default config;
