const autoprefixer = require('autoprefixer');
const atImport = require('postcss-import');
const postcssNested = require('postcss-nested');

const config = {
	plugins: [autoprefixer(), atImport(), postcssNested]
};

module.exports = config;
