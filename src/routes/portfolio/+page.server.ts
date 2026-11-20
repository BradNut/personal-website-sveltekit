import { buildPageMetaTags } from '#lib/shared/page-meta.ts';
import type { PageServerLoad } from './$types';
import { portfolioProjects } from './portfolio-projects';

export const load: PageServerLoad = async ({ url }) => {
  const metaTags = buildPageMetaTags({
    url,
    title: 'Portfolio',
    description: "Bradley Shellnut's Portfolio",
    og: {
      header: 'Portfolio | bradleyshellnut.com',
      page: 'My portfolio of sites I have created.',
    },
    imageAlt: 'Bradley Shellnut Portfolio Page',
  });

  return {
    metaTagsChild: metaTags,
    projects: portfolioProjects,
  };
};
