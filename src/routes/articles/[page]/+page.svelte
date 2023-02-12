<script lang="ts">
	import { page } from "$app/stores";
	import { articleStore } from "$lib/stores/articleStore";
	import { ArticleTag } from "$lib/types/articleTag";
	import Pagination from "$lib/components/pagination/index.svelte";
	import SEO from "$root/lib/components/SEO.svelte";
	import type { Article } from "$root/lib/types/article";
	import type { PageData } from "./$types";

	export let data: PageData;
	let articles: Article[];
	$: ({ articles, currentPage, totalPages, totalArticles, limit } = data);
	console.log(`Article +page currentPage: ${currentPage}`);
	console.log({ articles, currentPage, totalPages, totalArticles, limit });
</script>

<svelte:head>
	<title>{`Tech Articles - Page ${currentPage} | Bradley Shellnut`}</title>
	<meta name="og:site_name" content={`Tech Articles - Page ${currentPage}`} />
</svelte:head>

<div class="pageStyles">
	<h1 style="margin-bottom: 2rem">Favorite Tech Articles</h1>
	<Pagination
		additionalClasses="top-pagination"
		pageSize={limit}
		totalCount={totalArticles}
		currentPage={currentPage || 1}
		skip={page}
		base="/articles"
	/>
	<div class="articlesStyles">
		{#each articles as article (article.hashed_url)}
			<div class="articleStyles card">
				<section>
					<h3>
						<a
							target="_blank"
							aria-label={`Link to ${article.title}`}
							href={article.url.href}
							rel="noreferrer"
						>
							{article.title}
						</a>
					</h3>
				</section>
				<section>
					<p>Reading time: {article.reading_time} minutes</p>
					<div class="tagStyles">
						<p>Tags:</p>
						{#each article.tags as tag}
							<p>{tag}</p>
						{/each}
					</div>
				</section>
			</div>
		{/each}
	</div>
	<Pagination
		additionalClasses="bottom-pagination"
		pageSize={limit}
		totalCount={totalPages}
		currentPage={currentPage || 1}
		skip={page}
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
		a {
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

		p + p {
			background-color: var(--linkHover);
			color: var(--buttonTextColor);
			padding: 0.25rem 0.5rem;
			margin: 0.5rem;
			border-radius: 2px;
			font-size: 1.2rem;
		}
	}
</style>