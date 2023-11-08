import type { MetaTagsProps } from 'svelte-meta-tags';
import type { PageServerLoad } from './lib/$types';
import { fetchBandcampAlbums } from '$root/lib/util/fetchBandcampAlbums';

export const load: PageServerLoad = async ({ fetch, setHeaders, url }) => {
	const metaTags: MetaTagsProps = Object.freeze({
		title: 'Home',
		description: 'Home page',
		openGraph: {
			title: 'Home',
			description: 'Home page',
			url: new URL(url.pathname, url.origin).href,
			siteName: 'Bradley Shellnut Personal Website',
			images: [
				{
					url: '/static/b_shell_nut_favicon.png',
					alt: 'Bradley Shellnut Website Logo'
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: 'Home',
			description: 'Home page',
			images: '/static/b_shell_nut_favicon.png',
			imageAlt: 'Bradley Shellnut Website Logo'
		},
		url: new URL(url.pathname, url.origin).href
	});

	const albums = async () => await fetchBandcampAlbums();
	const articles = async () => await fetch(`/api/articles?page=1&limit=3`);

	setHeaders({
		'cache-control': 'max-age=43200'
	});
	return {
		metaTagsChild: metaTags,
		albums: albums(),
		articlesData: (await articles()).json()
	};
};
