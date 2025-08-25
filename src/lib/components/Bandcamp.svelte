<script lang="ts">
  import type { Album } from "$lib/types/album";
  import BandcampAlbum from './BandcampAlbum.svelte';

  const { albums }: { albums: Album[] } = $props();
  const displayAlbums =
    albums?.length > 6 ? albums.slice(0, 6) : albums;

	for (let album of displayAlbums) {
		album.src = {
			img: { src: `${album.artwork}`, w: 230, h: 230 },
			sources: {
				avif: `${album.artwork}`,
				webp: `${album.artwork}`,
				jpg: `${album.artwork}`
			}
		}
	}
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
		grid-template-columns: repeat(3, minmax(auto, 1fr));
		gap: 1rem;

		:global(.album-artwork) {
			aspect-ratio: auto 230 / 230;
			object-fit: cover;
		}

		@media (max-width: 1000px) {
			grid-template-columns: repeat(2, minmax(150px, 1fr));
		}

		@media (max-width: 575px) {
			height: 500px;
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

			grid-template-columns: minmax(230px, 1fr);
		}
	}
</style>