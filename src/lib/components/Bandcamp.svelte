<script lang="ts">
	import type { Album } from "$lib/types/album";
	import LazyImage from './LazyImage.svelte';

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
			<div class="albumStyles">
				<figure>
					<a
						title={`Link to ${album.title} by ${album.artist}`}
						target="_blank"
						href={album.url}
						rel="noreferrer"
					>
						<LazyImage clazz="album-artwork" src={album.src} alt={`Album art for ${album.title}`} />
					</a>
				</figure>
				<a
					target="_blank"
					href={album.url}
					rel="noreferrer"
				>
					<h3>{album.title.length > 20 ? `${album.title.slice(0, 20)}...` : album.title}</h3>
					<h3>{album.artist}</h3>
				</a>
			</div>
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

			/* ::-webkit-scrollbar {
				width: 12px;
			} */
			/* scrollbar-width: thin;
			scrollbar-color: var(--lightGrey) var(--darkGrey);
			::-webkit-scrollbar-track {
				background: var(--darkGrey);
			}
			::-webkit-scrollbar-thumb {
				background-color: var(--lightGrey);
				border-radius: 6px;
				border: 3px solid var(--darkGrey);
			} */
			grid-template-columns: minmax(230px, 1fr);
		}
	}

	.albumStyles {
		display: grid;
		justify-content: center;
		text-align: center;

		& figure {
			margin-left: auto;
			margin-right: auto;
		}

		@media (max-width: 550px) {
			font-size: 1rem;
			align-items: center;
		}
	}
</style>