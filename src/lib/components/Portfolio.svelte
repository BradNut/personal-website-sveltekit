<script lang="ts">
	import { Picture } from "svelte-lazy-loader";

	type ImageMeta = {
		format: string;
		src: string;
		type: string;
		width: string;
		height: string;
	};

	export let name: string;
	export let placeholder: string;
	export let src: string;
	export let alt: string;
	export let loading: "lazy" | "eager" = "lazy";
	export let formats: ImageMeta[];
</script>

<div class="portfolio">
	<div class="portfolio-picture">
		<h2>{name}</h2>
		<Picture {placeholder} {src} {loading} {alt}>
			{#each formats as { src, format, width }}
				<source data-srcset={src} type="image/{format}" {width} />
			{/each}
		</Picture>
		<slot name="portfolio-links" />
	</div>
	<div class="portfolio-details">
		<slot name="portfolio-details" />
	</div>
</div>

<style lang="postcss">
	:global(.portfolio-picture) {
		border-radius: 3px;
		max-width: 500px;
	}

	:global(.portfolio) {
		display: grid;
		grid-template-columns: minmax(200px, 500px) 1fr;
		width: 100%;
		margin: 1rem auto;

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
	}

	:global(.portfolio-details ul) {
		margin: 1rem;
		list-style: disc;
		padding-left: 1rem;
	}
</style>