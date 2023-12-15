import { json, error } from '@sveltejs/kit';
import { WALLABAG_MAX_PAGES } from '$env/static/private';
import { fetchArticlesApi } from '$root/routes/api';

export async function GET({ setHeaders, url }) {
	const page = url?.searchParams?.get('page') || '1';
	if (+page > +WALLABAG_MAX_PAGES) {
		error(404, 'Page does not exist');
	}

	try {
		const response = await fetchArticlesApi('get', `fetchArticles`, {
			page,
			limit: url?.searchParams?.get('limit') || '6'
		});

		if (response?.articles) {
			if (response?.cacheControl) {
				if (!response.cacheControl.includes('no-cache')) {
					setHeaders({
						'cache-control': response?.cacheControl
					});
				} else {
					setHeaders({
						'cache-control': 'max-age=43200'
					});
				}
			}

			return json(response);
		}
	} catch (e) {
		console.error(e);
		error(404, 'Page does not exist');
	}
};
