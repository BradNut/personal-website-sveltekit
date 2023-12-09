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
					url: `${baseUrl}?header=Home | bradleyshellnut.com&page=Hi I'm Bradley Shellnut.&content=I'm a full stack software engineer currently working on Java Spring, PostgreSQL, and React / Angular JS.`,
					alt: 'Bradley Shellnut Website Home Page',
					width: 1200,
					height: 630
				}
			]
		},
		twitter: {
			title: 'Home',
			description: 'Home page',
			card: 'summary_large_image',
			image: `${baseUrl}?header=Home | bradleyshellnut.com&page=Hi I'm Bradley Shellnut.&content=I'm a full stack software engineer currently working on Java Spring, PostgreSQL, and React / Angular JS.`,
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