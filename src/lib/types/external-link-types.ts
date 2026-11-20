import type { LucideIcon as IconType } from '@lucide/svelte';
import type { Snippet } from 'svelte';

export interface LinkTextType {
  text?: string;
  showIcon: boolean;
  location?: 'top' | 'bottom' | 'left' | 'right';
}

interface LinkDataType {
  rel?: string;
  target?: string;
  href: string;
  title?: string;
  ariaLabel: string;
  clazz?: string;
  textDecoration?: 'none' | 'underline' | 'line-through';
  trackingEvent?: string;
}

export interface ExternalLinkType {
  iconData?: LinkIconType;
  linkData: LinkDataType;
  textData?: LinkTextType;
}

export type LinkIconType =
  | {
      type: 'svg';
      icon: Snippet;
      iconClass?: string;
    }
  | {
      type: 'icon';
      icon: IconType;
      iconClass?: string;
    };
