import {
	WALLABAG_CLIENT_ID,
	WALLABAG_CLIENT_SECRET,
	WALLABAG_USERNAME,
	WALLABAG_PASSWORD,
	WALLABAG_URL,
	PAGE_SIZE,
	USE_REDIS_CACHE,
} from "$env/static/private";
import intersect from "just-intersect";
import type {
	Article,
	ArticlePageLoad,
	WallabagArticle,
} from "$lib/types/article";
import { ArticleTag } from "$lib/types/articleTag";
import type { PageQuery } from "$lib/types/pageQuery";
import { URLSearchParams } from "node:url";
import { redis } from "$lib/server/redis";

const base: string = WALLABAG_URL;

export async function fetchArticlesApi(
	method: string,
	resource: string,
	queryParams: Record<string, string>
) {
	let perPage = Number(queryParams?.limit);
	if (perPage > 30) {
		perPage = Number(PAGE_SIZE);
	} else {
		perPage = Number(queryParams?.limit);
	}

	const pageQuery: PageQuery = {
		sort: "updated",
		perPage,
		since: 0,
		page: Number(queryParams?.page) || 1,
		tags: "programming",
		content: "metadata",
	};
	const entriesQueryParams = new URLSearchParams({
		...pageQuery,
		perPage: `${pageQuery.perPage}`,
		since: `${pageQuery.since}`,
		page: `${pageQuery.page}`,
	});

	if (USE_REDIS_CACHE) {
		const cached = await redis.get(entriesQueryParams.toString());

		if (cached) {
			const response = JSON.parse(cached);
			const ttl = await redis.ttl(entriesQueryParams.toString());

			return { ...response, cacheControl: `max-age=${ttl}` };
		}
	}

	const authBody = {
		grant_type: "password",
		client_id: WALLABAG_CLIENT_ID,
		client_secret: WALLABAG_CLIENT_SECRET,
		username: WALLABAG_USERNAME,
		password: WALLABAG_PASSWORD,
	};

	const authResponse = await fetch(`${base}/oauth/v2/token`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams(authBody),
	});

	const auth = await authResponse.json();

	const pageResponse = await fetch(
		`${WALLABAG_URL}/api/entries.json?${entriesQueryParams}`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${auth.access_token}`,
			},
		}
	);

	if (!pageResponse.ok) {
		throw new Error(pageResponse.statusText);
	}

	const cacheControl = pageResponse.headers.get("cache-control") || "no-cache";

	const {
		_embedded: favoriteArticles,
		page,
		pages,
		total,
		limit,
	} = await pageResponse.json();
	const articles: Article[] = [];

	for (const article of favoriteArticles.items as WallabagArticle[]) {
		const rawTags = article?.tags?.map((tag) => tag.slug);
		if (intersect(rawTags, Object.values(ArticleTag))?.length > 0) {
			const tags = rawTags.map((rawTag) => rawTag as unknown as ArticleTag);
			articles.push({
				tags,
				title: article.title,
				url: new URL(article.url),
				domain_name: article.domain_name?.replace("www.", "") ?? "",
				hashed_url: article.hashed_url,
				reading_time: article.reading_time,
				preview_picture: article.preview_picture,
				created_at: new Date(article.created_at),
				updated_at: new Date(article.updated_at),
				archived_at: article.archived_at ? new Date(article.archived_at) : null,
			});
		}
	}

	const responseData: ArticlePageLoad = {
		articles,
		currentPage: page,
		totalPages: pages,
		limit,
		totalArticles: total,
		cacheControl,
	};

	if (USE_REDIS_CACHE) {
		redis.set(
			entriesQueryParams.toString(),
			JSON.stringify(responseData),
			"EX",
			43200
		);
	}

	return responseData;
}
