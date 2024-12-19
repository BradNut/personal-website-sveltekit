import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	extensions: ['.svelte'],
	preprocess: [vitePreprocess()],
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
			$root: './src'
		}
	},
	compilerOptions: {
		enableSourcemap: process.env.NODE_ENV === 'development',
	}
};

export default config;
