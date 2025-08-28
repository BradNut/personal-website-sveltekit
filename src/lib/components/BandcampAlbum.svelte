<script lang="ts">
  import type { Album } from "$lib/types/album";
  import LazyImage from './LazyImage.svelte';

  const { album }: { album: Album } = $props();
</script>

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

<style lang="postcss">
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
