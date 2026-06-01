import type { MetaTagsProps } from 'svelte-meta-tags';
import { resolveCurrentPageUrl, resolveOgEndpointUrl } from '$lib/shared/siteUrl';

const SITE_NAME = 'Bradley Shellnut Personal Website';
const TWITTER_IMAGE_ALT = 'Bradley Shellnut Website Logo';
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

type OgEndpointParams = {
  header: string;
  page: string;
  content?: string;
};

type PageMetaInput = {
  url: URL;
  title: string;
  description: string;
  og: OgEndpointParams;
  imageAlt: string;
  twitterDescription?: string;
};

export function buildPageMetaTags({ url, title, description, og, imageAlt, twitterDescription }: PageMetaInput): MetaTagsProps {
  const currentPageUrl = resolveCurrentPageUrl(url);
  const ogImageUrl = resolveOgEndpointUrl(url, og);

  return Object.freeze({
    title,
    description,
    openGraph: {
      title,
      description,
      url: currentPageUrl,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: ogImageUrl,
          alt: imageAlt,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
        },
      ],
    },
    twitter: {
      title,
      description: twitterDescription ?? description,
      card: 'summary_large_image',
      image: ogImageUrl,
      imageAlt: TWITTER_IMAGE_ALT,
    },
    url: currentPageUrl,
  });
}
