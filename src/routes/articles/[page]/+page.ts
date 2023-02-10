import type { PageLoad } from './$types';
import type { Article } from '$root/lib/types/article';

export const load: PageLoad = async ({ fetch, params }) => {
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
	// console.log(`Page: ${page}`);
	// try {
	// 	if (page && +page <= 5 && +page > 0) {
	// 		return {
	// 			currentPage: +page,
	// 			perPage: parentData?.perPage,
	// 			maxPages: parentData?.totalPages
	// 		};
	// 	} else {
	// 		console.log('Page load error 404');
	// 		throw error(404, 'Not found');
	// 	}
	// } catch (e) {
	// 	console.error(e);
	// 	throw error(500, 'Error');
	// }
};
