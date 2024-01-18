// export const prerender = true;

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
					url: `${baseUrl}og?header=Privacy Blog | bradleyshellnut.com&page=My thoughts on personal internet privacy.`,
					alt: 'Bradley Shellnut Privacy Blog',
					width: 1200,
					height: 630
				}
			]
		},
		twitter: {
			title: 'Privacy Blog',
			description: 'My thoughts on personal internet privacy.',
			card: 'summary_large_image',
			image: `${baseUrl}og?header=Privacy Blog | bradleyshellnut.com&page=My thoughts on personal internet privacy.`,
			imageAlt: 'Bradley Shellnut Website Logo'
		},
		url: currentPageUrl
	});

	return {
		metaTagsChild: metaTags
	};
};
