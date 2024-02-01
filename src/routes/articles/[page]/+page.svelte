<script lang="ts">
	import Pagination from "$lib/components/pagination/index.svelte";
	import Articles from "$lib/components/Articles.svelte";

	const { data } = $props();
	const articles = $derived(data.articles);
	const currentPage = $derived(data.currentPage);
	const totalArticles = $derived(data.totalArticles);
	const limit = $derived(data.limit);
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
