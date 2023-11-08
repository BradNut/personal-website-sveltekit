import type { MetaTagsProps } from 'svelte-meta-tags';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';
import { fetchBandcampAlbums } from '$lib/util/fetchBandcampAlbums';

export const load: PageServerLoad = async ({ fetch, setHeaders, url }) => {
	const baseUrl = new URL(url.origin).href || PUBLIC_SITE_URL || 'https://bradleyshellnut.com';
	const currentPageUrl = new URL(url.pathname, url.origin).href;

	const metaTags: MetaTagsProps = Object.freeze({
		title: 'Home',
		description: "My name is Bradley Shellnut and I'm a Full Stack Software Engineer.",
		openGraph: {
			title: 'Home',
			description: "My name is Bradley Shellnut and I'm a Full Stack Software Engineer.",
			url: currentPageUrl,
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
			title: 'Home',
			description: 'Home page',
			card: 'summary_large_image',
			image: `${baseUrl}b_shell_nut_favicon.gif`,
			imageAlt: 'Bradley Shellnut Website Logo'
		},
		url: currentPageUrl
	});

	const albums = async () => await fetchBandcampAlbums();
	const articles = async () => await fetch(`/api/articles?page=1&limit=3`);

	setHeaders({
		'cache-control': 'max-age=43200'
	});
	return {
		baseUrl,
		metaTagsChild: metaTags,
		albums: albums(),
		articlesData: (await articles()).json()
	};
};