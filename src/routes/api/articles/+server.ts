import { json } from '@sveltejs/kit';
import type { RequestHandler, RequestEvent } from './$types';
import { fetchArticlesApi } from '$root/routes/api';

export const GET: RequestHandler = async ({ url }: RequestEvent) => {
	try {
		const response = await fetchArticlesApi('get', `fetchArticles`, {
			page: url?.searchParams?.get('page') || '1'
		});

		if (response?.articles) {
			return json(response);
		}
	} catch (error) {
		console.error(error);
	}
};
