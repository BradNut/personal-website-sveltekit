import type { PageServerLoad } from './lib/$types';
import { PAGE_SIZE } from '$env/static/private';
import { fetchBandcampAlbums } from '$root/lib/util/fetchBandcampAlbums';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const albums = async () => await fetchBandcampAlbums();
	const articles = async () => await fetch(`/api/articles?page=1&limit=3`);
	// const art = articles.
	// console.log(`Articles: ${JSON.stringify(await (await articles()).json())}`);
	setHeaders({
		'cache-control': 'max-age=43200'
	});
	return {
		albums: albums(),
		articlesData: (await articles()).json()
	};
};
