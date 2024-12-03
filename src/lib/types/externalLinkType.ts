import type { IconifyIcon } from "iconify-icon";

export type ExternalLinkType = {
	ariaLabel: string;
	href: string;
	icon?: IconifyIcon;
	showIcon: boolean;
	text: string;
};