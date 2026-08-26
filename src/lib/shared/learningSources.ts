import type { LearningSource } from '$lib/types/learningSource';

export const learningSources: LearningSource[] = [
  {
    name: 'Wes Bos',
    href: 'https://wesbos.com/courses',
    subjects: ['React', 'GraphQL', 'JavaScript'],
  },
  {
    name: 'Scott Tolinski',
    href: 'https://tolin.ski',
    notableWork: { text: 'Level Up Tutorials', href: 'https://levelup.video' },
    subjects: ['React', 'TypeScript', 'SvelteKit', 'Remix', 'Figma', 'Design Systems'],
  },
  {
    name: 'Josh Comeau',
    href: 'https://www.joshwcomeau.com',
    notableWork: { text: 'The Joy of React', href: 'https://www.joyofreact.com' },
    subjects: ['Full Stack React', 'Next.js'],
  },
  {
    name: 'Amy Kapernick',
    href: 'https://www.amyskapers.dev/',
    subjects: ['Accessibility'],
  },
  {
    name: 'Matt Pocock',
    href: 'https://www.aihero.dev/',
    subjects: ['TypeScript', 'AI'],
  },
  {
    name: 'Syntax',
    href: 'https://syntax.fm',
    notableWork: {
      text: 'Self-Hosting with Coolify',
      href: 'https://www.youtube.com/watch?v=taJlPG82Ucw',
    },
    subjects: ['Coolify'],
  },
];
