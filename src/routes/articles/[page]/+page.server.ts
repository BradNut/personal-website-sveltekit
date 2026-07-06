import type { MetaTagsProps } from 'svelte-meta-tags';
import { fetchArticles } from '$lib/services/articlesApi';
import { resolveCurrentPageUrl, resolveOgEndpointUrl } from '$lib/shared/siteUrl';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders, url, parent }) => {
  const { page } = params;
  const { cacheControl } = await parent();

  if (cacheControl?.includes('no-cache')) {
    setHeaders({
      'cache-control': cacheControl,
    });
  } else {
    setHeaders({
      'cache-control': 'max-age=43200', // 12 hours
    });
  }

  const currentPageUrl = resolveCurrentPageUrl(url);
  const ogImageUrl = resolveOgEndpointUrl(url, {
    header: `Articles Page ${page} | bradleyshellnut.com`,
    page: 'My favorite articles',
  });

  const metaTags: MetaTagsProps = Object.freeze({
    title: 'Favorite Articles',
    description: 'My favorite articles',
    openGraph: {
      title: 'Favorite Articles',
      description: 'My favorite articles',
      url: currentPageUrl,
      siteName: 'Bradley Shellnut Personal Website',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: ogImageUrl,
          alt: `Bradley Shellnut Articles Page ${page}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: 'Favorite Articles',
      description: 'My favorite articles',
      card: 'summary_large_image',
      image: ogImageUrl,
      imageAlt: 'Bradley Shellnut Website Logo',
    },
    url: currentPageUrl,
  });

  const { articles, currentPage } = await fetchArticles({ page });

  return {
    articles,
    currentPage,
    metaTagsChild: metaTags,
  };
};
