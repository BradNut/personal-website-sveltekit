import {
	WALLABAG_CLIENT_ID,
	WALLABAG_CLIENT_SECRET,
	WALLABAG_USERNAME,
	WALLABAG_PASSWORD,
	WALLABAG_URL,
	WALLABAG_MAX_PAGES,
	PAGE_SIZE
} from '$env/static/private';
import intersect from 'just-intersect';
import type { Article, WallabagArticle } from '$root/lib/types/article';
import { ArticleTag } from '$root/lib/types/articleTag';
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
		perPage: +PAGE_SIZE,
		since: 0,
		page: +queryParams?.page || 1,
		tags: 'programming',
		content: 'metadata'
	};
	const entriesQueryParams = new URLSearchParams({
		...pageQuery,
		perPage: `${pageQuery.perPage}`,
		since: `${pageQuery.since}`,
		page: `${pageQuery.page}`
	});
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

	const cacheControl = pageResponse.headers.get('cache-control');

	const { _embedded, page, pages, total, limit } = await pageResponse.json();
	const articles: Article[] = [];

	// do {
	// 	nbEntries += entries._embedded.items.length;
	console.log(`number of articles fetched: ${_embedded.items.length}`);
	_embedded.items.forEach((article: WallabagArticle) => {
		// if (articles?.length === +WALLABAG_MAX_ARTICLES) {
		// 	console.log('Reached 30 articles');
		// 	return;
		// }
		const rawTags = article?.tags?.map((tag) => tag.slug);
		if (intersect(rawTags, Object.values(ArticleTag))?.length > 0) {
			const tags = rawTags.map((rawTag) => rawTag as unknown as ArticleTag);

			articles.push({
				tags,
				title: article.title,
				url: new URL(article.url),
				hashed_url: article.hashed_url,
				reading_time: article.reading_time,
				preview_picture: article.preview_picture,
				created_at: new Date(article.created_at),
				updated_at: new Date(article.updated_at),
				archived_at: article.archived_at ? new Date(article.archived_at) : null
			});
		}
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

	return {
		articles,
		currentPage: page,
		totalPages: pages <= WALLABAG_MAX_PAGES ? pages : WALLABAG_MAX_PAGES,
		limit,
		totalArticles: total > limit * WALLABAG_MAX_PAGES ? limit * WALLABAG_MAX_PAGES : total,
		cacheControl
	};
}
