import type { PageServerLoad } from './lib/$types';
import { fetchBandcampAlbums } from '$root/lib/util/fetchBandcampAlbums';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const albums = await fetchBandcampAlbums();
	setHeaders({
		'cache-control': 'max-age=43200'
	});
	return {
		albums
	};
};
