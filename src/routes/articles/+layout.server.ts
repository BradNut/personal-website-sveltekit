import { fetchArticles } from '$lib/services/articlesApi';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  // Fetch the first page to get common metadata (total articles, total pages, etc.)
  const data = await fetchArticles({ page: '1' });

  return {
    // Common metadata available to all child routes
    totalArticles: data.totalArticles,
    totalPages: data.totalPages,
    limit: data.limit,
    cacheControl: data.cacheControl,
  };
};
