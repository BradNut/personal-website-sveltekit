import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { imagetools } from "@zerodevx/svelte-img/vite";

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(),
		imagetools({
			// By default, directives are `?width=480;1024;1920&format=avif;webp;jpg`
			// Now we change it to generate 5 variants instead - `avif/jpg` formats at `640/1280` + LQIP (Now as:run)
			profiles: {
				run: new URLSearchParams(
					"?w=300;480;640;1024;1920&format=avif;webp;jpg&as=run:64"
				),
			},
		}),
	],
	esbuild: {
		target: "es2022",
	},
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
		mockReset: true,
	},
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			postcss: {
				additionalData: `
				@custom-media --below_small (width < 400px);
				@custom-media --below_med (width < 700px);
				@custom-media --below_large (width < 900px);
				@custom-media --below_xlarge (width < 1200px);

				@custom-media --above_small (width > 400px);
				@custom-media --above_med (width > 700px);
				@custom-media --above_large (width > 900px);
				@custom-media --above_xlarge (width > 1200px);
				`,
			},
		},
	},
});
