export const prerender = true;

import { PUBLIC_SITE_URL } from "$env/static/public";
import type { MetaTagsProps } from "svelte-meta-tags";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url }) => {
	const baseUrl =
		new URL(url.origin).href ||
		PUBLIC_SITE_URL ||
		"https://bradleyshellnut.com";
	const currentPageUrl = new URL(url.pathname, url.origin).href;
	const metaTags: MetaTagsProps = Object.freeze({
		title: "About",
		description: "About Bradley Shellnut",
		openGraph: {
			title: "About",
			description: "About Bradley Shellnut",
			url: currentPageUrl,
			siteName: "Bradley Shellnut Personal Website",
			type: "website",
			locale: "en_US",
			images: [
				{
					url: `${baseUrl}og?header=About | bradleyshellnut.com&page=Hey! My name is Bradley Shellnut.&content=I am a full stack software engineer who's interested in new tech and not afraid to discover new interests.`,
					alt: "About Bradley Shellnut",
					width: 1200,
					height: 630,
				},
			],
		},
		twitter: {
			title: "About",
			description: "About page",
			card: "summary_large_image",
			image: `${baseUrl}og?header=About | bradleyshellnut.com&page=Hey! My name is Bradley Shellnut.&content=I am a full stack software engineer who's interested in new tech and not afraid to discover new interests.`,
			imageAlt: "Bradley Shellnut Website Logo",
		},
		url: currentPageUrl,
	});

	return {
		metaTagsChild: metaTags,
	};
};
