// fallow-ignore-next-line code-duplication
export const prerender = true;

import type { MetaTagsProps } from 'svelte-meta-tags';
import { resolveCurrentPageUrl, resolveOgEndpointUrl } from '$lib/shared/siteUrl';
import type { PageServerLoad } from './$types';

// fallow-ignore-next-line code-duplication
export const load: PageServerLoad = async ({ url }) => {
  const currentPageUrl = resolveCurrentPageUrl(url);
  const ogImageUrl = resolveOgEndpointUrl(url, {
    header: 'Portfolio | bradleyshellnut.com',
    page: 'My portfolio of sites I have created.',
  });

  const metaTags: MetaTagsProps = Object.freeze({
    title: 'Portfolio',
    description: "Bradley Shellnut's Portfolio",
    openGraph: {
      title: 'Portfolio',
      description: "Bradley Shellnut's Portfolio",
      url: currentPageUrl,
      siteName: 'Bradley Shellnut Personal Website',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: ogImageUrl,
          alt: 'Bradley Shellnut Portfolio Page',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: 'Portfolio',
      description: "Bradley Shellnut's Portfolio",
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
