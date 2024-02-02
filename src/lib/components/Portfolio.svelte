<script lang="ts">
	import LazyImage from './LazyImage.svelte';

	const { name, src, alt, style = "", loading = "lazy" } = $props<{
		name: string;
		src: Record<string, any>;
		alt: string;
		style: string;
		loading?: "lazy" | "eager";
	}>();
</script>

<div class="portfolio">
	<div class="portfolio-picture">
		<h2>{name}</h2>
		<LazyImage {style} {src} {alt} {loading} />
		<slot name="portfolio-links" />
	</div>
	<div class="portfolio-details">
		<slot name="portfolio-details" />
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

	:global(.portfolio p) {
		margin: 1rem 0;
		padding: 0;
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