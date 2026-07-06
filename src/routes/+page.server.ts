import { fetchArticles } from '$lib/services/articlesApi';
import { buildPageMetaTags } from '$lib/shared/pageMeta';
import { resolveSiteUrl } from '$lib/shared/siteUrl';
import type { Album } from '$lib/types/album';
import type { ArticlePageLoad } from '$lib/types/article';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders, url }) => {
  const baseUrl = resolveSiteUrl(url);

  const metaTags = buildPageMetaTags({
    url,
    title: 'Home',
    description: "My name is Bradley Shellnut and I'm a Full Stack Software Engineer.",
    og: {
      header: 'Home | bradleyshellnut.com',
      page: "Hi I'm Bradley Shellnut.",
      content: "I'm a full stack software engineer currently working on Java Spring, PostgreSQL, and SvelteKit.",
    },
    imageAlt: 'Bradley Shellnut Website Home Page',
    twitterDescription: 'Home page',
  });

  const [albums, articles]: [Album[], ArticlePageLoad] = await Promise.all([
    (await fetch('/api/bandcamp/albums')).json(),
    fetchArticles({ page: '1', limit: '3' }),
  ]);

  setHeaders({
    'cache-control': 'max-age=43200',
  });
  return {
    baseUrl,
    metaTagsChild: metaTags,
    albums,
    articlesData: articles,
  };
};
