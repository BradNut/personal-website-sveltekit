import type { Snippet } from 'svelte';
import type { Icon as IconType } from 'lucide-svelte';

export interface LinkTextType {
	text?: string;
	showIcon: boolean;
	location?: 'top' | 'bottom' | 'left' | 'right';
}

export interface LinkDataType {
	rel?: string;
	target?: string;
	href: string;
	title?: string;
	ariaLabel: string;
	clazz?: string | undefined;
	textDecoration?: 'none' | 'underline' | 'line-through';
}

export interface ExternalLinkType {
  iconData?: LinkIconType;
  linkData: LinkDataType;
  textData?: LinkTextType;
}

export interface LinkIconType {
  type?: 'icon' | 'svg';
  icon?: Snippet | typeof IconType;
  iconClass?: string | undefined;
}