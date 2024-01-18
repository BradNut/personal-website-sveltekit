import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { preprocessMeltUI } from '@melt-ui/pp';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import relativeImages from 'mdsvex-relative-images';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	preprocess: [vitePreprocess(), mdsvex(mdsvexConfig), preprocessMeltUI()],
	vitePlugin: {
		inspector: {
			toggleKeyCombo: 'control-alt-shift',
			showToggleButton: 'always',
			toggleButtonPos: 'bottom-right'
		}
	},
	kit: {
		adapter: adapter(),
		alias: {
			$root: './src',
			$paraglide: './src/paraglide/'
		},
		// Need for crawling to work until
		// https://github.com/sveltejs/kit/issues/11133
		// is fixed
		prerender: {
			entries: ["/"],
		},
	}
};

export default config;
