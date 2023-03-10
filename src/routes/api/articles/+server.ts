import { json, error } from '@sveltejs/kit';
import { WALLABAG_MAX_PAGES } from '$env/static/private';
import type { RequestHandler, RequestEvent } from './$types';
import { fetchArticlesApi } from '$root/routes/api';

export const GET: RequestHandler = async ({ setHeaders, url }: RequestEvent) => {
	try {
		const page = url?.searchParams?.get('page') || '1';
		if (+page > +WALLABAG_MAX_PAGES) {
			throw new Error('Page does not exist');
		}
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

			// console.log(`API response ${JSON.stringify(response)}`);
			return json(response);
		}
	} catch (e) {
		console.error(e);
		throw error(404, 'Page does not exist');
	}
};
