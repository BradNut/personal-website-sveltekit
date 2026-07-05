<script lang="ts">
	import type { Snippet } from "svelte";
	import type { Picture } from "vite-imagetools";
	import ExternalLink from "$lib/components/ExternalLink.svelte";
	import type { ProjectLink } from "$lib/types/externalLinkType";

	const {
		externalLinks,
		name,
		src,
		alt,
		style,
		fetchPriority = "auto",
		loading = "lazy",
		children,
	}: {
		externalLinks: ProjectLink[];
		name: string;
		src: string | Picture;
		alt: string;
		style: string;
		fetchPriority?: "high" | "low" | "auto";
		loading?: "lazy" | "eager";
		children?: Snippet;
	} = $props();
</script>

<div class="portfolio">
	<div class="portfolio-picture">
		<h2>{name}</h2>
		<enhanced:img {src} {style} {alt} fetchpriority={fetchPriority} {loading} />
		<div class="project-links">
			{#each externalLinks as projectLink}
				<ExternalLink {projectLink} iconSize={20} />
			{/each}
		</div>
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

	.project-links {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	:global(.project-links a) {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 0.75rem 1.25rem;
		font-weight: 500;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;

		&:hover {
			background: rgba(255, 255, 255, 0.1);
			border-color: var(--shellYellow);
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		}

		&:active {
			transform: translateY(0);
		}
	}
</style>
