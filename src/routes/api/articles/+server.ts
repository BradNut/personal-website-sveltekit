import { json } from '@sveltejs/kit';
import type { RequestHandler, RequestEvent } from './$types';
import { fetchArticlesApi } from '$root/routes/api';

export const GET: RequestHandler = async ({ url, setHeaders, request, params }: RequestEvent) => {
	try {
		const response = await fetchArticlesApi('get', `search`, {});

		if (response?.articles) {
			setHeaders({
				'cache-control': 'max-age=604800'
			});

			const articlesResponse = response.articles;
			console.log(`Found articles ${articlesResponse.length}`);
			const articles = [];

			for (const article of articlesResponse) {
				const { tags, title, url, hashed_url, reading_time, preview_picture } = article;
				articles.push({ tags, title, url, hashed_url, reading_time, preview_picture });
			}

			return json(articles);
		}
	} catch (error) {
		console.error(error);
	}
};
