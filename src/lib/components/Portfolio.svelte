<script lang="ts">
	import Img from '@zerodevx/svelte-img';

	export let name: string;
	export let src: Record<string, any>;
	export let alt: string;
	export let style: string;
	export let loading: "lazy" | "eager" = "lazy";
</script>

<div class="portfolio">
	<div class="portfolio-picture">
		<h2>{name}</h2>
		<Img class="portfolio-image better-blur" {style} {src} {alt} {loading} />
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

	:global(img.better-blur)::after {
		content: '';
		position: absolute;
		inset: 0;
		backdrop-filter: blur(20px);
		pointer-events: none;
	}

	:global(.portfolio) {
		display: grid;
		grid-template-columns: minmax(200px, 500px) auto;
		/* width: 100%; */
		margin: 1.5rem auto;

		@media (max-width: 800px) {
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