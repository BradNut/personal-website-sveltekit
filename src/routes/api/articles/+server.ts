import { json } from '@sveltejs/kit';
import type { RequestHandler, RequestEvent } from './$types';
import { fetchArticlesApi } from '$root/routes/api';

export const GET: RequestHandler = async ({ url, setHeaders }: RequestEvent) => {
	try {
		const response = await fetchArticlesApi('get', `fetchArticles`, {
			page: url?.searchParams?.get('page') || '1'
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

			// const articlesResponse = response.articles;
			// console.log(`Found articles ${articlesResponse?.articles?.length}`);
			// const articles = [];

			// for (const article of articlesResponse) {
			// 	const { tags, title, url, hashed_url, reading_time, preview_picture } = article;
			// 	articles.push({ tags, title, url, hashed_url, reading_time, preview_picture });
			// }

			return json(response);
		}
	} catch (error) {
		console.error(error);
	}
};
