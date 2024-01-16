import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import fs from 'fs';
import type { UserConfig } from 'vite';
// import { imagetools } from '@zerodevx/svelte-img/vite';

const config: UserConfig = {
	plugins: [
		enhancedImages(),
		sveltekit(),
		rawFonts(['.ttf'])
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

function rawFonts(ext) {
	return {
		name: 'vite-plugin-raw-fonts',
		resolveId(id) {
			return ext.some((e) => id.endsWith(e)) ? id : null;
		},
		transform(code, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return { code: `export default ${JSON.stringify(buffer)}`, map: null };
			}
		}
	};
}

export default config;
