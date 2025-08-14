import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	// Fetch the first page to get common metadata (total articles, total pages, etc.)
	const resp = await fetch('/api/articles?page=1');
	const data = await resp.json();

	console.log('Data: ', JSON.stringify(data));

	return {
		// Common metadata available to all child routes
		totalArticles: data.totalArticles,
		totalPages: data.totalPages,
		limit: data.limit,
		cacheControl: data.cacheControl
	};
};
