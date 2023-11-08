import type { MetaTagsProps } from 'svelte-meta-tags';
import type { PageServerLoad } from './lib/$types';
import { fetchBandcampAlbums } from '$root/lib/util/fetchBandcampAlbums';

export const load: PageServerLoad = async ({ fetch, setHeaders, url }) => {
	const baseUrl = new URL(url.origin).href;
	const metaTags: MetaTagsProps = Object.freeze({
		title: 'Home',
		description: "My name is Bradley Shellnut and I'm a Full Stack Software Engineer.",
		openGraph: {
			title: 'Home',
			description: "My name is Bradley Shellnut and I'm a Full Stack Software Engineer.",
			url: new URL(url.pathname, url.origin).href,
			siteName: 'Bradley Shellnut Personal Website',
		},
		twitter: {
			title: 'Home',
			description: 'Home page',
		},
		url: new URL(url.pathname, url.origin).href
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
// <link rel="icon" type="image/gif" href="/b_shell_nut_favicon.gif" />;