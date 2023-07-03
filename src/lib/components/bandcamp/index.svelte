<script lang="ts">
	import Img from '@zerodevx/svelte-img';
	import type { Album } from "$root/lib/types/album";


	export let albums: Album[];
	const displayAlbums =
		albums?.length > 6 ? albums.slice(0, 6) : albums;

	for (let album of displayAlbums) {
		album.src = [
			{ format: 'avif', src: `${album.artwork}`, width: 230, height: 230 },
			{ format: 'webp', src: `${album.artwork}`, width: 230, height: 230 },
			{ format: 'jpg', src: `${album.artwork}`, width: 230, height: 230 }
		]
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
						<Img class="album-artwork" src={album.src} alt={`Album art for ${album.title}`} />
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