export type PortfolioProjectLink = {
  ariaLabel: string;
  href: string;
  iconKey?: 'github' | 'external';
  showIcon: boolean;
  text: string;
  linkType?: 'repo' | 'site';
};

export type TechStackItem = {
  label: string;
  href?: string;
};

export type PortfolioProject = {
  name: string;
  category: 'personal' | 'professional';
  imageKey: string;
  alt: string;
  style: string;
  loading?: 'lazy' | 'eager';
  externalLinks: PortfolioProjectLink[];
  techStack: TechStackItem[];
  description: string[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    name: 'Personal Website',
    category: 'personal',
    imageKey: 'personalSite',
    alt: "Picture of Bradley Shellnut's Personal Website",
    style: 'max-height: 550px;',
    loading: 'eager',
    externalLinks: [
      {
        ariaLabel: 'View GitHub repository for my personal website',
        href: 'https://github.com/BradNut/personal-website-sveltekit',
        iconKey: 'github',
        showIcon: true,
        text: 'GitHub repository',
      },
    ],
    techStack: [
      { label: 'SvelteKit', href: 'https://kit.svelte.dev/' },
      { label: 'Bits-UI', href: 'https://bits-ui.com/' },
      { label: 'TypeScript', href: 'https://www.typescriptlang.org/' },
      { label: 'Coolify' },
    ],
    description: [
      'My personal website re-written using SvelteKit.',
      'The previous version was written using React and Gatsby.',
      'Each iteration brings better code and my previous React version was improved after the suggestions on Show 444 of the Syntax Podcast.',
    ],
  },
  {
    name: 'Wedding Website',
    category: 'personal',
    imageKey: 'weddingWebsite',
    alt: 'Picture of NextJS Wedding Website',
    style: 'max-height: 550px;',
    externalLinks: [
      {
        ariaLabel: 'View live wedding site demo',
        href: 'https://weddingsite-six.vercel.app/',
        iconKey: 'external',
        showIcon: true,
        text: 'View Site',
        linkType: 'site',
      },
      {
        ariaLabel: 'View GitHub repository for the wedding site',
        href: 'https://github.com/BradNut/weddingsite',
        iconKey: 'github',
        showIcon: true,
        text: 'GitHub repository',
        linkType: 'repo',
      },
    ],
    techStack: [
      { label: 'Next.js 13' },
      { label: 'React 18' },
      { label: 'Radix UI', href: 'https://radix-ui.com/' },
      { label: 'MongoDB' },
      { label: 'Styled Components' },
      { label: 'Next Iron Session' },
    ],
    description: [
      'The app was initially created for my wedding but what is linked here is a public demo of the application.',
      'An application that allows viewing of wedding details and provides the ability to RSVP to the wedding.',
    ],
  },
  {
    name: 'Old Personal Website',
    category: 'personal',
    imageKey: 'oldSite',
    alt: 'Home Page of the old bradleyshellnut.com website',
    style: 'max-height: 320px;',
    externalLinks: [
      {
        ariaLabel: 'Archive of bradleyshellnut.com',
        href: 'https://web.archive.org/web/20201205233507/https://bradleyshellnut.com/about',
        iconKey: 'github',
        showIcon: true,
        text: 'Link to an archive snapshot',
      },
    ],
    techStack: [{ label: 'React' }, { label: 'Redux' }, { label: 'ReactStrap' }, { label: 'React Router' }],
    description: ['My first personal website.', 'This was my first real personal website hosted on DigitalOcean.'],
  },
  {
    name: 'Mark Shellnut Architect',
    category: 'professional',
    imageKey: 'shellnutArchitectWebsite',
    alt: "Picture of Mark Shellnut Architect's Website",
    style: 'max-height: 550px;',
    externalLinks: [
      {
        ariaLabel: 'View Mark Shellnut Architect',
        href: 'https://markshellnutarchitect.com',
        showIcon: false,
        text: 'Link to Mark Shellnut Architect',
      },
    ],
    techStack: [
      { label: 'React 18' },
      { label: 'Gatsby 5' },
      { label: 'Radix UI', href: 'https://radix-ui.com/' },
      { label: 'Styled Components' },
      { label: 'GraphQL' },
      { label: 'Lambda Functions' },
    ],
    description: ['Company website for Mark Shellnut Architect.'],
  },
];
