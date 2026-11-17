import type { LinkIconType } from './external-link-types';

export type ProjectLink = {
  ariaLabel: string;
  href: string;
  icon?: LinkIconType;
  showIcon: boolean;
  text: string;
};
