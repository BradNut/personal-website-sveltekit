import { json, error } from '@sveltejs/kit';
import { PAGE_SIZE } from '$env/static/private';
import { fetchArticlesApi } from '$lib/api';

export async function GET({ setHeaders, url }) {
	const page = url?.searchParams?.get('page') || '1';
	let limit = url?.searchParams?.get('limit') ?? PAGE_SIZE;
	if (Number(limit) > 30) {
		limit = PAGE_SIZE;
	}

	try {
		const response = await fetchArticlesApi('get', 'fetchArticles', {
			page,
			limit
		});

		console.log(`JSON articles response: ${JSON.stringify(response)}`);

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
