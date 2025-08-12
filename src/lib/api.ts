import {
	PAGE_SIZE,
	USE_REDIS_CACHE,
	WALLABAG_CLIENT_ID,
	WALLABAG_CLIENT_SECRET,
	WALLABAG_PASSWORD,
	WALLABAG_URL,
	WALLABAG_USERNAME,
} from "$env/static/private";
import { redis } from "$lib/server/redis";
import type {
	Article,
	ArticlePageLoad,
	WallabagArticle,
} from "$lib/types/article";
import { ArticleTag } from "$lib/types/articleTag";
import intersect from "just-intersect";
import type { PageQuery } from "./types/pageQuery";

const base: string = WALLABAG_URL;

// Retry helper with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 500
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff: 500ms, 1s, 2s
      const delay = baseDelay * (2 ** attempt);
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export async function fetchArticlesApi(
	method: string,
	resource: string,
	queryParams: Record<string, string>
) {
	try {
		let perPage = Number(queryParams?.limit);
		if (perPage === undefined || perPage > 30 || perPage < 1) {
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
			sort: pageQuery.sort,
			perPage: `${pageQuery.perPage}`,
			since: `${pageQuery.since}`,
			page: `${pageQuery.page}`,
			tags: pageQuery.tags,
			content: pageQuery.content,
		});

		if (USE_REDIS_CACHE === 'true') {
			console.log('Using redis cache');
			const cacheKey = entriesQueryParams.toString();
			console.log(`Cache key: ${cacheKey}`);
			const cached = await redis.get(cacheKey);

			if (cached) {
				console.log("Cache hit!");
				const response = JSON.parse(cached);
				const ttl = await redis.ttl(cacheKey);

				console.log(`Returning cached response for page ${pageQuery.page} with ttl of ${ttl} seconds`);
				console.log(`Response: ${JSON.stringify(response)}`);
				return { ...response, cacheControl: `max-age=${ttl}` };
			}
			console.log(`Cache miss for page ${pageQuery.page}, fetching from API`);
		}

		const authBody = {
			grant_type: "password",
			client_id: WALLABAG_CLIENT_ID,
			client_secret: WALLABAG_CLIENT_SECRET,
			username: WALLABAG_USERNAME,
			password: WALLABAG_PASSWORD,
		};

		console.log(`Auth body: ${JSON.stringify(authBody)}`);

		const auth = await retryWithBackoff(async () => {
			const authResponse = await fetch(`${base}/oauth/v2/token`, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams(authBody),
				signal: AbortSignal.timeout(10000), // 10 second timeout
			});
			
			if (!authResponse.ok) {
				throw new Error(`Auth failed: ${authResponse.status} ${authResponse.statusText}`);
			}
			
			return await authResponse.json();
		});

		console.log(`Got auth response: ${JSON.stringify(auth)}`);

		const { wallabagResponse, cacheControl } = await retryWithBackoff(async () => {
			const pageResponse = await fetch(
				`${WALLABAG_URL}/api/entries.json?${entriesQueryParams}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${auth.access_token}`,
					},
					signal: AbortSignal.timeout(15000), // 15 second timeout
				}
			);

			console.log('pageResponse', pageResponse);

			if (!pageResponse.ok) {
				console.log('pageResponse not ok', pageResponse);
				throw new Error(`API request failed: ${pageResponse.status} ${pageResponse.statusText}`);
			}

			const cacheControl = pageResponse.headers.get("cache-control") || "no-cache";
			const wallabagResponse = await pageResponse.json();
			
			return { wallabagResponse, cacheControl };
		});
		console.log('wallabagResponse', JSON.stringify(wallabagResponse));
		const {
			_embedded: favoriteArticles,
			page,
			pages,
			total,
			limit,
		} = wallabagResponse;
		const articles: Article[] = [];

		console.log('favoriteArticles', JSON.stringify(favoriteArticles));
		console.log('pages', pages);
		console.log('page', page);
		console.log('total', total);
		console.log('limit', limit);

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

		console.log('Response data from API: ', JSON.stringify(responseData))

		if (USE_REDIS_CACHE === 'true' && responseData?.articles?.length > 0) {
			const cacheKey = entriesQueryParams.toString();
			console.log(`Storing in cache with key: ${cacheKey} for page ${page}`);
			redis.set(
				cacheKey,
				JSON.stringify(responseData),
				"EX",
				43200
			);
		}

		return responseData;
	} catch (error) {
		console.error(`Error fetching articles for page ${queryParams?.page}:`, error);
		
		// Return empty response on error to prevent app crash
		const fallbackResponse: ArticlePageLoad = {
			articles: [],
			currentPage: Number(queryParams?.page) || 1,
			totalPages: 0,
			limit: Number(queryParams?.limit) || Number(PAGE_SIZE),
			totalArticles: 0,
			cacheControl: 'no-cache',
		};
		
		return fallbackResponse;
	}
}
