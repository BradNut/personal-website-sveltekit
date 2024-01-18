<script lang="ts">
	import Pagination from "$lib/components/pagination/index.svelte";
	import * as m from "$paraglide/messages";
	import type { Article } from "$lib/types/article";
	import Articles from "$lib/components/Articles.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
	let articles: Article[];
	let currentPage: number;
	let totalPages: number;
	let totalArticles: number;
	let limit: number;
	$: ({ articles, currentPage, totalPages, totalArticles, limit } = data);
	$: seoTitle = `Tech Articles - Page ${currentPage} | Bradley Shellnut`;
</script>

<div class="pageStyles">
	<h1 style="margin-bottom: 2rem">{m.articles_favorite_tech_articles()}</h1>
	<Pagination
		additionalClasses="top-pagination"
		pageSize={limit}
		totalCount={totalArticles}
		currentPage={currentPage || 1}
		skip={currentPage}
		base="/articles"
	/>
	<Articles {articles} {totalArticles} classes={['columns']} />
	<Pagination
		additionalClasses="bottom-pagination"
		pageSize={limit}
		totalCount={totalArticles}
		currentPage={currentPage || 1}
		skip={currentPage}
		base="/articles"
	/>
</div>

<style lang="postcss">
	.pageStyles {
		.bottom-pagination {
			display: none;
		}

		@media (max-width: 650px) {
			.bottom-pagination {
				display: flex;
			}
		}
	}

	.articlesStyles {
		display: grid;
		grid-template-columns: repeat(2, minmax(250px, 1fr));
		min-height: 800px;

		@media (max-width: 1000px) {
			grid-template-columns: repeat(2, minmax(250px, 1fr));
		}

		@media (max-width: 650px) {
			grid-template-columns: minmax(250px, 1fr);
		}

		gap: 2.5rem;
	}

	.articleStyles {
		display: grid;
		grid-template-rows: 1fr auto;
		align-items: start;
		& a {
			cursor: pointer;
		}

		/* p {
			margin: 0.4rem 0.25rem;
		} */
	}

	.tagStyles {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: left;
		align-items: center;

		& p + p {
			background-color: var(--linkHover);
			color: var(--buttonTextColor);
			padding: 0.25rem 0.5rem;
			margin: 0.5rem;
			border-radius: 2px;
			font-size: 1.2rem;
		}
	}
</style>