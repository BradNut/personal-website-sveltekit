import {
	WALLABAG_CLIENT_ID,
	WALLABAG_CLIENT_SECRET,
	WALLABAG_USERNAME,
	WALLABAG_PASSWORD,
	WALLABAG_URL
} from '$env/static/private';
import type { Article } from '$root/lib/types/article';
import type { PageQuery } from '$root/lib/types/pageQuery';
import { URLSearchParams } from 'url';

const base: string = WALLABAG_URL;

export async function fetchArticlesApi(
	method: string,
	resource: string,
	queryParams: Record<string, string>,
	data?: Record<string, unknown>
) {
	let lastFetched: Date | null = null;

	const authBody = {
		grant_type: 'password',
		client_id: WALLABAG_CLIENT_ID,
		client_secret: WALLABAG_CLIENT_SECRET,
		username: WALLABAG_USERNAME,
		password: WALLABAG_PASSWORD
	};

	const authResponse = await fetch(`${base}/oauth/v2/token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams(authBody)
	});

	const auth = await authResponse.json();

	const pageQuery: PageQuery = {
		sort: 'updated',
		perPage: 6,
		since: 0
	};
	const entriesQueryParams = new URLSearchParams(pageQuery);
	console.log(`Entries params: ${entriesQueryParams}`);

	if (lastFetched) {
		pageQuery.since = Math.round(lastFetched / 1000);
	}

	lastFetched = new Date();

	const nbEntries = 0;
	const pageResponse = await fetch(`${WALLABAG_URL}/api/entries.json?${entriesQueryParams}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${auth.access_token}`
		}
	});

	if (!pageResponse.ok) {
		throw new Error(pageResponse.statusText);
	}

	const entries = await pageResponse.json();
	const articles: Article[] = [];

	// do {
	// 	nbEntries += entries._embedded.items.length;
	console.log(`number of articles fetched: ${entries._embedded.items.length}`);
	entries._embedded.items.forEach((article: Article) => {
		article.created_at = new Date(article.created_at);
		article.updated_at = new Date(article.updated_at);
		article.archived_at = article.archived_at ? new Date(article.archived_at) : null;
		articles.push(article);
	});

	// if (!entries._links.next) {
	// 	return;
	// }
	// console.log(`Links next ${JSON.stringify(entries._links.next)}`);
	// const response = await fetch(entries._links.next.href, {
	// 	method: 'GET',
	// 	headers: {
	// 		Authorization: `Bearer ${auth.access_token}`
	// 	}
	// });
	// entries = await response.json();
	// } while (entries._links.next);

	return { articles };
}
