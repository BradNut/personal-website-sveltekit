import { fetchArticles } from '#lib/services/articlesApi.ts';
import { articlesPageCacheControl } from '#lib/shared/articlesCacheControl.ts';
import { buildPageMetaTags } from '#lib/shared/pageMeta.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders, url, parent }) => {
  const { page } = params;
  // The articles layout's own articles result (it currently fetches page 1 for shared metadata)
  const { cacheControl: layoutCacheControl } = await parent();

  const metaTags = buildPageMetaTags({
    url,
    title: 'Favorite Articles',
    description: 'My favorite articles',
    og: {
      header: `Articles Page ${page} | bradleyshellnut.com`,
      page: 'My favorite articles',
    },
    imageAlt: `Bradley Shellnut Articles Page ${page}`,
  });

  const { articles, currentPage, cacheControl } = await fetchArticles({ page });

  setHeaders({
    'cache-control': articlesPageCacheControl(layoutCacheControl, cacheControl),
  });

  return {
    articles,
    currentPage,
    metaTagsChild: metaTags,
  };
};
