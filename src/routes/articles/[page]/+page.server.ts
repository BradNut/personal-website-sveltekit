import type { PageServerLoad } from './$types';
import type { Article } from '$root/lib/types/article';

export type ArticlePageLoad = {
	articles: Article[];
	currentPage: number;
	totalPages: number;
	limit: number;
	totalArticles: number;
	cacheControl: string;
};

export const load: PageServerLoad = async ({ fetch, params, setHeaders }) => {
	const { page } = params;
	const resp = await fetch(`/api/articles?page=${page}`);
	const { articles, currentPage, totalPages, limit, totalArticles, cacheControl }: ArticlePageLoad =
		await resp.json();

	if (cacheControl?.includes('no-cache')) {
		setHeaders({
			'cache-control': cacheControl
		});
	} else {
		setHeaders({
			'cache-control': 'max-age=43200' // 12 hours
		});
	}
	return {
		articles,
		currentPage,
		totalPages,
		limit,
		totalArticles
	};
};
