import type { MetaTagsProps } from 'svelte-meta-tags';
import type { PageServerLoad } from './$types';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { ArticlePageLoad } from '$lib/types/article';

export const load: PageServerLoad = async ({ fetch, params, setHeaders, url }) => {
	const { page } = params;
	const resp = await fetch(`/api/articles?page=${page}`);
	const {
		articles,
		currentPage,
		totalPages,
		limit,
		totalArticles,
		cacheControl,
	}: ArticlePageLoad = await resp.json();

	if (cacheControl?.includes('no-cache')) {
		setHeaders({
			'cache-control': cacheControl,
		});
	} else {
		setHeaders({
			'cache-control': 'max-age=43200', // 12 hours
		});
	}

	const baseUrl = new URL(url.origin).href || PUBLIC_SITE_URL || 'https://bradleyshellnut.com';
	const currentPageUrl = new URL(url.pathname, url.origin).href;

	const metaTags: MetaTagsProps = Object.freeze({
		title: 'Favorite Articles',
		description: 'My favorite articles',
		openGraph: {
			title: 'Favorite Articles',
			description: 'My favorite articles',
			url: currentPageUrl,
			siteName: 'Bradley Shellnut Personal Website',
			type: 'website',
			locale: 'en_US',
			images: [
				{
					url: `${baseUrl}og?header=Articles Page ${page} | bradleyshellnut.com&page=My favorite articles`,
					alt: `Bradley Shellnut Articles Page ${page}`,
					width: 1200,
					height: 630,
				},
			],
		},
		twitter: {
			title: 'Favorite Articles',
			description: 'My favorite articles',
			card: 'summary_large_image',
			image: `${baseUrl}og?header=Articles Page ${page} | bradleyshellnut.com&page=My favorite articles`,
			imageAlt: 'Bradley Shellnut Website Logo',
		},
		url: currentPageUrl,
	});

	return {
		articles,
		currentPage,
		totalPages,
		limit,
		totalArticles,
		metaTagsChild: metaTags,
	};
};
