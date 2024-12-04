<script lang="ts">
	import type { Picture } from 'vite-imagetools';
	import type { Snippet } from 'svelte';
	import type { ExternalLinkType } from '$lib/types/externalLinkType';

	const {
		links,
		details,
		portfolioDetails,
		externalLinks,
		name,
		src,
		alt,
		style,
		fetchPriority = 'auto',
		loading = 'lazy',
	}: { links: Snippet<ExternalLinkType[]>, details: Snippet<string>, portfolioDetails: string,
		externalLinks: ExternalLinkType[], name: string; src: string | Picture; alt: string;
		style: string; fetchPriority?: 'high' | 'low' | 'auto'; loading?: 'lazy' | 'eager' } = $props();
</script>

<div class="portfolio">
	<div class="portfolio-picture">
		<h2>{name}</h2>
		<enhanced:img {src} {style} {alt} fetchpriority={fetchPriority} {loading} />
		{@render links(externalLinks)}
	</div>
	<div class="portfolio-details">
		{@render details(portfolioDetails)}
	</div>
</div>

<style lang="postcss">
	:global(.portfolio-picture) {
		border-radius: 3px;
	}

	:global(.portfolio) {
		display: grid;
		grid-template-columns: minmax(200px, 500px) auto;
		margin: 1.5rem auto;

		@media (width <= 1200px) {
			grid-template-columns: minmax(200px, 500px);
			place-items: center;
		}
	}

	:global(.portfolio-details) {
		margin: 0 1.5rem;

		@media (max-width: 800px) {
			margin: 1rem 1.5rem;
		}
	}

	:global(.portfolio-details ul) {
		list-style-type: disc;
		padding-left: 1.5rem;
	}
</style>