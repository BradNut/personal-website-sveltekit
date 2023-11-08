export const prerender = true;

import type { MetaTagsProps } from 'svelte-meta-tags';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const baseUrl = new URL(url.origin).href || PUBLIC_SITE_URL || 'https://bradleyshellnut.com';
	const currentPageUrl = new URL(url.pathname, url.origin).href;

	const metaTags: MetaTagsProps = Object.freeze({
		title: 'Privacy Blog',
		description: 'My thoughts on personal internet privacy.',
		openGraph: {
			title: 'Privacy Blog',
			description: 'My thoughts on personal internet privacy.',
			url: new URL(url.pathname, url.origin).href,
			siteName: 'Bradley Shellnut Personal Website',
			type: 'website',
			locale: 'en_US',
			images: [
				{
					url: `${baseUrl}b_shell_nut_favicon.gif`,
					alt: 'Bradley Shellnut Website Logo',
					width: 512,
					height: 512
				}
			]
		},
		twitter: {
			title: 'Privacy Blog',
			description: 'My thoughts on personal internet privacy.',
			card: 'summary_large_image',
			image: `${baseUrl}b_shell_nut_favicon.gif`,
			imageAlt: 'Bradley Shellnut Website Logo'
		},
		url: currentPageUrl
	});

	return {
		metaTagsChild: metaTags
	};
};
