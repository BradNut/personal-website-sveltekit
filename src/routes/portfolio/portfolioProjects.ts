export type PortfolioProjectLink = {
  ariaLabel: string;
  href: string;
  iconKey?: 'github' | 'external';
  showIcon: boolean;
  text: string;
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
      {
        ariaLabel: 'Listen to Syntax Podcast Show 444, Syntax Highlight',
        href: 'https://syntax.fm/show/444/syntax-highlight',
        iconKey: 'external',
        showIcon: true,
        text: 'Syntax Podcast Show 444',
      },
    ],
    techStack: [
      { label: 'SvelteKit', href: 'https://kit.svelte.dev/' },
      { label: 'Bits-UI', href: 'https://bits-ui.com/' },
      { label: 'TypeScript', href: 'https://www.typescriptlang.org/' },
      { label: 'Coolify', href: 'https://coolify.io' },
    ],
    description: [
      'My personal website built with SvelteKit, Bits-UI, and TypeScript.',
      'It is a living project that improves with each rewrite.',
      'This version incorporates feedback from Syntax Podcast Show 444 — Syntax Highlight.',
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
      },
      {
        ariaLabel: 'View GitHub repository for the wedding site',
        href: 'https://github.com/BradNut/weddingsite',
        iconKey: 'github',
        showIcon: true,
        text: 'GitHub repository',
      },
    ],
    techStack: [
      { label: 'Next.js 13', href: 'https://nextjs.org' },
      { label: 'React 18', href: 'https://react.dev' },
      { label: 'Radix UI', href: 'https://radix-ui.com/' },
      { label: 'MongoDB', href: 'https://www.mongodb.com' },
      { label: 'Styled Components', href: 'https://styled-components.com' },
      { label: 'Next Iron Session', href: 'https://github.com/vvo/iron-session' },
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
    techStack: [
      { label: 'React', href: 'https://react.dev' },
      { label: 'Redux', href: 'https://redux.js.org' },
      { label: 'ReactStrap', href: 'https://reactstrap.github.io' },
      { label: 'React Router', href: 'https://reactrouter.com' },
    ],
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
      { label: 'React 18', href: 'https://react.dev' },
      { label: 'Gatsby 5', href: 'https://www.gatsbyjs.com' },
      { label: 'Radix UI', href: 'https://radix-ui.com/' },
      { label: 'Styled Components', href: 'https://styled-components.com' },
      { label: 'GraphQL', href: 'https://graphql.org' },
    ],
    description: ['Company website for Mark Shellnut Architect, built with Gatsby 5, React 18, and GraphQL.'],
  },
];
