export type Course = {
	name: string,
	externalLinks: ExternalLink[],
	tags: string[]
}

export type ExternalLink = {
	ariaLabel: string,
	href: string,
	showIcon: boolean,
	text: string
}