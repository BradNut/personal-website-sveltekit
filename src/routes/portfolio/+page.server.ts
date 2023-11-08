export const prerender = true;

import type { MetaTagsProps } from 'svelte-meta-tags';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const metaTags: MetaTagsProps = Object.freeze({
		title: 'Portfolio',
		description: 'Bradley Shellnut\s Portfolio',
		openGraph: {
			title: 'Portfolio',
			description: 'Bradley Shellnut\s Portfolio',
			url: new URL(url.pathname, url.origin).href
		}
	});

	return {
		metaTagsChild: metaTags
	};
};
