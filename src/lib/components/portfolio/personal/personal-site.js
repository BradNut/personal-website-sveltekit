import meta from '$lib/assets/images/portfolio/Bradley_Shellnut_New_Site.png?w=350;450;500&metadata';
import srcsetauto from '$lib/assets/images/portfolio/Bradley_Shellnut_New_Site.png?w=450;1274;637;500&png&srcset';
import srcsetwebp from '$lib/assets/images/portfolio/Bradley_Shellnut_New_Site.png?w=450;1274;637;500&webp&srcset';
import placeholder from '$lib/assets/images/portfolio/Bradley_Shellnut_New_Site.png?w=100&png&blur=10';

const { width, height, src } = meta;

const data = {
	width,
	height,
	src,
	loading: 'eager',
	sources: [
		{ srcset: srcsetwebp, type: 'image/webp' },
		{ srcset: srcsetauto, type: 'image/png' }
	],
	placeholder
};

export { data as default };
