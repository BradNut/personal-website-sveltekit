import { getCurrentCookieValue } from '$lib/util/cookieUtils';
import type { Article } from '$root/lib/types/article';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent, url, setHeaders }) => {
	const parentData = await parent();

	const cacheBust = getCurrentCookieValue('articles-cache') || parentData.articlesCacheBust;
	const search = url.searchParams.get('search') || '';

	const resp = await fetch(`/api/articles?cache=${cacheBust}`);
	const articles: Article[] = await resp.json();

	return {
		articles
	};
};
