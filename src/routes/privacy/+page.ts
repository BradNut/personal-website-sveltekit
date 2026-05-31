// fallow-ignore-next-line code-duplication
export const prerender = true;

import type { MetaTagsProps } from 'svelte-meta-tags';
import { resolveCurrentPageUrl, resolveOgEndpointUrl } from '$lib/shared/siteUrl';
import type { PageLoad } from './$types';

// fallow-ignore-next-line code-duplication
export const load: PageLoad = async ({ url }) => {
  const currentPageUrl = resolveCurrentPageUrl(url);
  const ogImageUrl = resolveOgEndpointUrl(url, {
    header: 'Privacy Blog | bradleyshellnut.com',
    page: 'My thoughts on personal internet privacy.',
  });

  const metaTags: MetaTagsProps = Object.freeze({
    title: 'Privacy Blog',
    description: 'My thoughts on personal internet privacy.',
    openGraph: {
      title: 'Privacy Blog',
      description: 'My thoughts on personal internet privacy.',
      url: currentPageUrl,
      siteName: 'Bradley Shellnut Personal Website',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: ogImageUrl,
          alt: 'Bradley Shellnut Privacy Blog',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: 'Privacy Blog',
      description: 'My thoughts on personal internet privacy.',
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
