export const prerender = true;

import type { MetaTagsProps } from 'svelte-meta-tags';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const baseUrl = new URL(url.origin).href || PUBLIC_SITE_URL || 'https://bradleyshellnut.com';
  const currentPageUrl = new URL(url.pathname, url.origin).href;

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
          url: `${baseUrl}og?header=Portfolio | bradleyshellnut.com&page=My portfolio of sites I have created.`,
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
      image: `${baseUrl}og?header=Portfolio | bradleyshellnut.com&page=My portfolio of sites I have created.`,
      imageAlt: 'Bradley Shellnut Website Logo',
    },
    url: currentPageUrl,
  });

  return {
    metaTagsChild: metaTags,
  };
};
