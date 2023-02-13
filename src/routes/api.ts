import {
	WALLABAG_CLIENT_ID,
	WALLABAG_CLIENT_SECRET,
	WALLABAG_USERNAME,
	WALLABAG_PASSWORD,
	WALLABAG_URL,
	WALLABAG_MAX_ARTICLES,
	PAGE_SIZE,
	USE_REDIS_CACHE
} from '$env/static/private';
import intersect from 'just-intersect';
import type { Article, WallabagArticle } from '$root/lib/types/article';
import { ArticleTag } from '$root/lib/types/articleTag';
import type { PageQuery } from '$root/lib/types/pageQuery';
import { URLSearchParams } from 'url';
import { redis } from '$root/lib/server/redis';

const base: string = WALLABAG_URL;

export async function fetchArticlesApi(
	method: string,
	resource: string,
	queryParams: Record<string, string>,
	data?: Record<string, unknown>
) {
	const pageQuery: PageQuery = {
		sort: 'updated',
		perPage: +PAGE_SIZE,
		since: 0,
		page: +queryParams?.page || 1,
		tags: 'programming',
		content: 'metadata'
	};
	const entriesQueryParams = new URLSearchParams(pageQuery);
	console.log(`Entries params: ${entriesQueryParams}`);
	if (USE_REDIS_CACHE) {
		const cached = await redis.get(entriesQueryParams.toString());

		if (cached) {
			const response = JSON.parse(cached);
			console.log('Cache hit!');
			const ttl = await redis.ttl(entriesQueryParams.toString());

			return { ...response, cacheControl: `max-age=${ttl}` };
		}
	}

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
				url: article.url,
				hashed_url: article.hashed_url,
				reading_time: article.reading_time,
				preview_picture: article.preview_picture,
				created_at: new Date(article.created_at),
				updated_at: new Date(article.updated_at),
				archived_at: article.archived_at ? new Date(article.archived_at) : null
			});
		}
	});

	const responseData = {
		articles,
		currentPage: page,
		totalPages: pages,
		limit,
		totalArticles: total,
		cacheControl
	};

	if (USE_REDIS_CACHE) {
		redis.set(entriesQueryParams.toString(), JSON.stringify(responseData), 'EX', 43200);
	}

	return responseData;
}
