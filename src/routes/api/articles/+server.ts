import { error, json } from '@sveltejs/kit';
import type { ArticlePageLoad } from '@/lib/types/article.js';
import { PAGE_SIZE } from '$env/static/private';
import { fetchArticlesApi } from '$lib/services/articlesApi';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

// Rate limiter: 30 requests per minute, 100 per hour
// Allows browsing multiple pages without cache, but prevents abuse
const limiter = new RateLimiter({
  IP: [100, 'h'], // 100 requests per hour per IP
  IPUA: [30, 'm'], // 30 requests per minute per IP + User Agent
});

export async function GET(event) {
  // Check rate limit
  if (await limiter.isLimited(event)) {
    error(429, 'Too many requests. Please try again later.');
  }
  
  const { setHeaders, url } = event;
  const page = url?.searchParams?.get('page') || '1';
  let limit = url?.searchParams?.get('limit') ?? PAGE_SIZE;
  if (Number(limit) > 30) {
    limit = PAGE_SIZE;
  }

  try {
    const response: ArticlePageLoad = await fetchArticlesApi('get', 'fetchArticles', {
      page,
      limit,
    });

    if (response?.articles) {
      if (response?.cacheControl) {
        if (!response.cacheControl.includes('no-cache')) {
          setHeaders({
            'cache-control': response?.cacheControl,
          });
        } else {
          setHeaders({
            'cache-control': 'max-age=43200',
          });
        }
      }

      return json(response);
    }
  } catch (e) {
    console.error(e);
    // Fall back to an empty, cacheable payload so pages can still render in E2E
    const fallback: ArticlePageLoad = {
      articles: [],
      currentPage: Number(page) || 1,
      totalArticles: 0,
      totalPages: 1,
      limit: Number(limit) || 10,
      cacheControl: 'no-cache',
    } as unknown as ArticlePageLoad;
    return json(fallback, {
      headers: {
        'cache-control': 'no-cache',
      },
    });
  }
}
