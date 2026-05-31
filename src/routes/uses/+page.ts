// fallow-ignore-next-line code-duplication
export const prerender = true;

import type { MetaTagsProps } from 'svelte-meta-tags';
import { resolveCurrentPageUrl, resolveOgEndpointUrl } from '$lib/shared/siteUrl';
import type { PageLoad } from './$types';

// fallow-ignore-next-line code-duplication
export const load: PageLoad = async ({ url }) => {
  const currentPageUrl = resolveCurrentPageUrl(url);
  const ogImageUrl = resolveOgEndpointUrl(url, { header: 'Uses | bradleyshellnut.com', page: 'What I use!' });

  const metaTags: MetaTagsProps = Object.freeze({
    title: '/Uses',
    description: 'What I use!',
    openGraph: {
      title: '/Uses',
      description: 'What I use!',
      url: currentPageUrl,
      siteName: 'Bradley Shellnut Personal Website',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: ogImageUrl,
          alt: 'Bradley Shellnut Uses Page',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: '/Uses',
      description: 'What I use!',
      card: 'summary_large_image',
      image: ogImageUrl,
      imageAlt: 'Bradley Shellnut Website Logo',
    },
    url: currentPageUrl,
  });

  return {
    metaTagsChild: metaTags,
  };
};
