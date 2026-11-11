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

const link = (iconKey: 'github' | 'external', text: string, ariaLabel: string, href: string): PortfolioProjectLink => ({
  ariaLabel,
  href,
  iconKey,
  showIcon: true,
  text,
});

const TECH = {
  react: { label: 'React', href: 'https://react.dev' },
  react18: { label: 'React 18', href: 'https://react.dev' },
  radix: { label: 'Radix UI', href: 'https://radix-ui.com/' },
  styledComponents: { label: 'Styled Components', href: 'https://styled-components.com' },
} satisfies Record<string, TechStackItem>;

export const portfolioProjects: PortfolioProject[] = [
  {
    name: 'Personal Website',
    category: 'personal',
    imageKey: 'personalSite',
    alt: "Picture of Bradley Shellnut's Personal Website",
    style: 'max-height: 550px;',
    loading: 'eager',
    externalLinks: [
      link('github', 'GitHub repository', 'View GitHub repository for my personal website', 'https://github.com/BradNut/personal-website-sveltekit'),
      link(
        'external',
        'Syntax Podcast Show 444',
        'Listen to Syntax Podcast Show 444, Syntax Highlight',
        'https://syntax.fm/show/444/syntax-highlight',
      ),
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
      link('external', 'View Site', 'View live wedding site demo', 'https://weddingsite-six.vercel.app/'),
      link('github', 'GitHub repository', 'View GitHub repository for the wedding site', 'https://github.com/BradNut/weddingsite'),
    ],
    techStack: [
      { label: 'Next.js 13', href: 'https://nextjs.org' },
      TECH.react18,
      TECH.radix,
      { label: 'MongoDB', href: 'https://www.mongodb.com' },
      TECH.styledComponents,
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
      link(
        'github',
        'Link to an archive snapshot',
        'Archive of bradleyshellnut.com',
        'https://web.archive.org/web/20201205233507/https://bradleyshellnut.com/about',
      ),
    ],
    techStack: [
      TECH.react,
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
      TECH.react18,
      { label: 'Gatsby 5', href: 'https://www.gatsbyjs.com' },
      TECH.radix,
      TECH.styledComponents,
      { label: 'GraphQL', href: 'https://graphql.org' },
    ],
    description: ['Company website for Mark Shellnut Architect, built with Gatsby 5, React 18, and GraphQL.'],
  },
];
