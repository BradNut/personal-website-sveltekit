import { error, json, type RequestEvent } from '@sveltejs/kit';
import type { ArticlePageLoad } from '@/lib/types/article.js';
import { PAGE_SIZE } from '$env/static/private';
import { fetchArticlesApi } from '$lib/services/articlesApi';

export async function GET(event: RequestEvent) {
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
