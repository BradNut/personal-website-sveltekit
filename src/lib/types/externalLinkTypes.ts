import type { Icon as IconType } from 'lucide-svelte';

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
      icon: () => unknown;
      iconClass?: string;
    }
  | {
      type: 'icon';
      icon: typeof IconType;
      iconClass?: string;
    };
