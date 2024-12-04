<script lang="ts">
	import { run } from 'svelte/legacy';

	import Pagination from '$lib/components/Pagination.svelte';
	import type { Article } from '$lib/types/article';
	import Articles from '$lib/components/Articles.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let articles: Article[] = $state();
	let currentPage: number = $state();
	let totalArticles: number = $state();
	let limit: number = $state();

	run(() => {
		if (data) {
			({ articles, currentPage, totalArticles, limit } = data);
		}
	});
</script>

<h1 style:margin-bottom={"2rem"}>Favorite Tech Articles</h1>
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