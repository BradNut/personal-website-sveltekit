export const prerender = true;

import { buildPageMetaTags } from '$lib/shared/pageMeta';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
  const metaTags = buildPageMetaTags({
    url,
    title: 'About',
    description: 'About Bradley Shellnut',
    og: {
      header: 'About | bradleyshellnut.com',
      page: 'Hey! My name is Bradley Shellnut.',
      content: "I am a full stack software engineer who's interested in new tech and not afraid to discover new interests.",
    },
    imageAlt: 'About Bradley Shellnut',
    twitterDescription: 'About page',
  });

  return {
    metaTagsChild: metaTags,
  };
};
