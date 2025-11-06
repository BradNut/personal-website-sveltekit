import type { Icon as IconType } from 'lucide-svelte';
import type { Snippet } from 'svelte';

export type ExternalLinkType = {
  ariaLabel: string;
  href: string;
  icon?: Snippet | typeof IconType;
  showIcon: boolean;
  text: string;
};
