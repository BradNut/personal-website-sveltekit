import type { PageServerLoad } from './$types';
import type { Article } from '$root/lib/types/article';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const { page } = params;
	const resp = await fetch(`/api/articles?page=${page}`);
	const {
		articles,
		currentPage,
		totalPages,
		limit,
		totalArticles
	}: {
		articles: Article[];
		currentPage: number;
		totalPages: number;
		limit: number;
		totalArticles: number;
	} = await resp.json();
	return {
		articles,
		currentPage,
		totalPages,
		limit,
		totalArticles
	};
};
