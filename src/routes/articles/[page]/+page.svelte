<script lang="ts">
	import Pagination from '$lib/components/pagination/index.svelte';
	import type { Article } from '$lib/types/article';
	import Articles from '$lib/components/Articles.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let articles: Article[];
	let currentPage: number;
	let totalArticles: number;
	let limit: number;
	$: ({ articles, currentPage, totalPages, totalArticles, limit } = data);

	$: console.log(currentPage, totalPages, totalArticles, limit);
</script>

<div>
	<h1 style="margin-bottom: 2rem">Favorite Tech Articles</h1>
		<Pagination
		additionalClasses="top-pagination"
		pageSize={limit}
		totalCount={totalArticles}
		currentPage={currentPage || 1}
		base="/articles"
	/>
	<Articles {articles} {totalArticles} classes={['columns']} />
	<Pagination
		additionalClasses="bottom-pagination"
		pageSize={limit}
		totalCount={totalArticles}
		currentPage={currentPage || 1}
		base="/articles"
	/>
</div>
