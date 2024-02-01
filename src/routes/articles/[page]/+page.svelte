<script lang="ts">
	import Pagination from "$lib/components/pagination/index.svelte";
	import type { Article } from "$lib/types/article";
	import Articles from "$lib/components/Articles.svelte";
	import type { PageData } from "./$types";

	const { data } = $props();
	const { articles, currentPage, totalArticles, limit } = $state(data);
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
