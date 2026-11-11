import type { LinkIconType } from './externalLinkTypes';

export type ProjectLink = {
  ariaLabel: string;
  href: string;
  icon?: LinkIconType;
  showIcon: boolean;
  text: string;
};
