export const prerender = true;

import { buildPageMetaTags } from '$lib/shared/pageMeta';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
  const metaTags = buildPageMetaTags({
    url,
    title: '/Uses',
    description: 'What I use!',
    og: { header: 'Uses | bradleyshellnut.com', page: 'What I use!' },
    imageAlt: 'Bradley Shellnut Uses Page',
  });

  return {
    metaTagsChild: metaTags,
  };
};
