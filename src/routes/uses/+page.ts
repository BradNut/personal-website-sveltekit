export const prerender = true;

import type { MetaTagsProps } from 'svelte-meta-tags';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const metaTags: MetaTagsProps = Object.freeze({
		title: 'Portfolio',
		description: 'Bradley Shellnuts Portfolio',
		openGraph: {
			title: 'Portfolio',
			description: 'Bradley Shellnuts Portfolio',
			url: new URL(url.pathname, url.origin).href
		}
	});

	return {
		metaTagsChild: metaTags
	};
};
