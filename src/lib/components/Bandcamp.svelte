<script lang="ts">
	import type { Album } from "#lib/types/album.ts";
	import BandcampAlbum from "./BandcampAlbum.svelte";

	let { albums }: { albums: Album[] } = $props();
	const displayAlbums = $derived(albums.slice(0, 6));
</script>

<div>
	<h2>Currently listening to:</h2>
	<div class="albumsStyles">
		{#each displayAlbums as album}
			<BandcampAlbum {album} />
		{/each}
	</div>
</div>

<style lang="postcss">
	.albumsStyles {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;

		:global(.album-artwork) {
			aspect-ratio: auto 230 / 230;
			object-fit: cover;
		}

		@media (max-width: 1000px) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		@media (max-width: 575px) {
			max-height: 500px;
			overflow-x: hidden;
			overflow-y: auto;

			scrollbar-width: thin;
			scrollbar-color: var(--lightGrey) var(--darkGrey);

			&::-webkit-scrollbar {
				width: 12px;
			}

			&::-webkit-scrollbar-track {
				background: var(--darkGrey);
			}

			&::-webkit-scrollbar-thumb {
				background-color: var(--lightGrey);
				border-radius: 6px;
				border: 3px solid var(--darkGrey);
			}

			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
