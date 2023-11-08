export const prerender = true;

import type { MetaTagsProps } from 'svelte-meta-tags';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const metaTags: MetaTagsProps = Object.freeze({
		title: 'Privacy Blog',
		description: 'My thoughts on personal internet privacy.',
		openGraph: {
			title: 'Privacy Blog',
			description: 'My thoughts on personal internet privacy.',
			url: new URL(url.pathname, url.origin).href
		}
	});

	return {
		metaTagsChild: metaTags
	};
};
