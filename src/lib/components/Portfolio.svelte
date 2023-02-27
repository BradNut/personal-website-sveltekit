<script lang="ts">
	import type { SvelteComponent } from "svelte";
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

<div class="gridItemStyles">
	<div class="portfolioPicture">
		<h2>{name}</h2>
		<Picture {placeholder} {src} {loading} {alt}>
			{#each formats as { src, format, width }}
				<source data-srcset={src} type="image/{format}" {width} />
			{/each}
		</Picture>
	</div>
	<div class="portfolio-details">
		<slot />
	</div>
</div>

<style lang="postcss">
	:global(.portfolioPicture) {
		border-radius: 3px;
		max-width: 500px;
		/* width: minmax(200px, 500px); */
	}

	:global(.gridItemStyles) {
		display: grid;
		grid-template-columns: minmax(200px, 500px) 1fr;
		width: 100%;
		gap: 2rem;
		margin: 0 auto;

		@media (max-width: 800px) {
			grid-template-columns: 1fr;
		}

		p {
			margin: 1rem 0;
			padding: 0;
		}
	}
</style>