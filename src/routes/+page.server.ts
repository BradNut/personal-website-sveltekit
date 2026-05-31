import type { MetaTagsProps } from 'svelte-meta-tags';
import { resolveCurrentPageUrl, resolveOgEndpointUrl, resolveSiteUrl } from '$lib/shared/siteUrl';
import type { Album } from '$lib/types/album';
import type { ArticlePageLoad } from '$lib/types/article';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders, url }) => {
  const baseUrl = resolveSiteUrl(url);
  const currentPageUrl = resolveCurrentPageUrl(url);

  const metaTags: MetaTagsProps = Object.freeze({
    title: 'Home',
    description: "My name is Bradley Shellnut and I'm a Full Stack Software Engineer.",
    openGraph: {
      title: 'Home',
      description: "My name is Bradley Shellnut and I'm a Full Stack Software Engineer.",
      url: currentPageUrl,
      siteName: 'Bradley Shellnut Personal Website',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: resolveOgEndpointUrl(url, {
            header: 'Home | bradleyshellnut.com',
            page: "Hi I'm Bradley Shellnut.",
            content: "I'm a full stack software engineer currently working on Java Spring, PostgreSQL, and React / Angular JS.",
          }),
          alt: 'Bradley Shellnut Website Home Page',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: 'Home',
      description: 'Home page',
      card: 'summary_large_image',
      image: resolveOgEndpointUrl(url, {
        header: 'Home | bradleyshellnut.com',
        page: "Hi I'm Bradley Shellnut.",
        content: "I'm a full stack software engineer currently working on Java Spring, PostgreSQL, and SvelteKit.",
      }),
      imageAlt: 'Bradley Shellnut Website Logo',
    },
    url: currentPageUrl,
  });

  const [albums, articles]: [Album[], ArticlePageLoad] = await Promise.all([
    (await fetch('/api/bandcamp/albums')).json(),
    (await fetch('/api/articles?page=1&limit=3')).json(),
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
