const postcssPresetEnv = require('postcss-preset-env');
const atImport = require('postcss-import');
const postCssCustomMedia = require('postcss-custom-media');

const config = {
	plugins: [
		atImport(),
		postcssPresetEnv({
			stage: 3,
			features: {
				'nesting-rules': true,
				'custom-media-queries': true,
				'media-query-ranges': true
			}
		}),
		postCssCustomMedia({
			customMedia: {
				'--below_small': '(width < 400px)',
				'--below_med': '(width < 700px)',
				'--below_large': '(width < 900px)',
				'--below_xlarge': '(width < 1200px)',
				'--above_small': '(width > 400px)',
				'--above_med': '(width > 700px)',
				'--above_large': '(width > 900px)',
				'--above_xlarge': '(width > 1200px)',
			}
		})
	]
};

module.exports = config;
