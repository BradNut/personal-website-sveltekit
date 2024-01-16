import { sveltekit } from '@sveltejs/kit/vite';
import { paraglide } from '@inlang/paraglide-js-adapter-vite';
import fs from 'fs';
import type { UserConfig } from 'vite';
import { imagetools } from '@zerodevx/svelte-img/vite';

const config: UserConfig = {
	plugins: [
		sveltekit(),
		paraglide({
			project: './project.inlang',
			outdir: './src/paraglide'
		}),
		imagetools({
			// By default, directives are `?width=480;1024;1920&format=avif;webp;jpg`
			// Now we change it to generate 5 variants instead - `avif/jpg` formats at `640/1280` + LQIP (Now as:run)
			profiles: {
				run: new URLSearchParams('?w=300;480;640;1024;1920&format=avif;webp;jpg&as=run:64')
			}
		}),
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
