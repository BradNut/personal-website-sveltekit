import meta from '$lib/assets/images/portfolio/Wedding_Website.png?w=450&metadata';
import srcsetauto from '$lib/assets/images/portfolio/Wedding_Website.png?w=1536;1280;500&png&srcset';
import srcsetwebp from '$lib/assets/images/portfolio/Wedding_Website.png?w=1536;1280;500&webp&srcset';
import placeholder from '$lib/assets/images/portfolio/Wedding_Website.png?w=100&png&blur=10';

const { width, height, src } = meta;

const data = {
	width,
	height,
	src,
	sources: [
		{ srcset: srcsetwebp, type: 'image/webp' },
		{ srcset: srcsetauto, type: 'image/png' }
	],
	placeholder
};

export { data as default };
