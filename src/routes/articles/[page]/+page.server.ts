import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { WALLABAG_MAX_PAGES } from '$env/static/private';
import type { Article } from '$lib/types/article';

export type ArticlePageLoad = {
	articles: Article[];
	currentPage: number;
	totalPages: number;
	limit: number;
	totalArticles: number;
};

export const load: PageServerLoad = async ({ fetch, params }) => {
	const { page } = params;
	if (+page > +WALLABAG_MAX_PAGES) {
		throw error(404, {
			message: 'Not found'
		});
	}
	const resp = await fetch(`/api/articles?page=${page}`);
	const { articles, currentPage, totalPages, limit, totalArticles }: ArticlePageLoad =
		await resp.json();
	return {
		articles,
		currentPage,
		totalPages,
		limit,
		totalArticles
	};
};
