export const prerender = true;

import type { MetaTagsProps } from 'svelte-meta-tags';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const metaTags: MetaTagsProps = Object.freeze({
		title: 'About',
		description: 'About Bradley Shellnut',
		openGraph: {
			title: 'About',
			description: 'About Bradley Shellnut',
			url: new URL(url.pathname, url.origin).href,
		}
	});

	return {
		metaTagsChild: metaTags
	}
}
