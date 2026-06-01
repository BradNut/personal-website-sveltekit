export const prerender = true;

import { buildPageMetaTags } from '$lib/shared/pageMeta';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
  const metaTags = buildPageMetaTags({
    url,
    title: 'Privacy Blog',
    description: 'My thoughts on personal internet privacy.',
    og: {
      header: 'Privacy Blog | bradleyshellnut.com',
      page: 'My thoughts on personal internet privacy.',
    },
    imageAlt: 'Bradley Shellnut Privacy Blog',
  });

  return {
    metaTagsChild: metaTags,
  };
};
