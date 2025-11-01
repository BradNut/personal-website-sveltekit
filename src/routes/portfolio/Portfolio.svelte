<script lang="ts">
import type { Picture } from 'vite-imagetools';
import type { Snippet } from 'svelte';
import type { ExternalLinkType } from '$lib/types/externalLinkType';

const {
  links,
  externalLinks,
  name,
  src,
  alt,
  style,
  fetchPriority = 'auto',
  loading = 'lazy',
  children,
}: {
  links: Snippet<[ExternalLinkType[]]>;
  externalLinks: ExternalLinkType[];
  name: string;
  src: string | Picture;
  alt: string;
  style: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  loading?: 'lazy' | 'eager';
  children?: Snippet;
} = $props();
</script>

<div class="portfolio">
	<div class="portfolio-picture">
		<h2>{name}</h2>
		<enhanced:img {src} {style} {alt} fetchpriority={fetchPriority} {loading} />
		{@render links(externalLinks)}
	</div>
	<div class="portfolio-details">
		{@render children?.()}
	</div>
</div>

<style lang="postcss">
	:global(.portfolio-picture) {
		border-radius: 8px;
		overflow: hidden;
	}

	:global(.portfolio-picture h2) {
		margin-bottom: 1rem;
	}

	:global(.portfolio) {
		display: grid;
		grid-template-columns: minmax(200px, 500px) auto;
		margin: 2rem auto;
		gap: 2rem;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.02);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.05);

		@media (width <= 1200px) {
			grid-template-columns: minmax(200px, 500px);
			place-items: center;
		}
	}

	:global(.portfolio-details) {
		margin: 0;

		@media (max-width: 800px) {
			margin: 0;
		}
	}

	:global(.portfolio-details ul) {
		list-style-type: disc;
		padding-left: 1.5rem;
	}
</style>
