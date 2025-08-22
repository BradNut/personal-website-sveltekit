<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Album } from "$lib/types/album";
  import BandcampAlbum from "./BandcampAlbum.svelte";

  export const sampleAlbum: Album = {
    title: "Album One",
    artist: "Artist A",
    url: "https://example.com",
    artwork: "https://picsum.photos/230?1",
    src: {
      img: { src: "https://picsum.photos/230?1", w: 230, h: 230 },
      sources: {
        avif: "https://picsum.photos/230?1",
        webp: "https://picsum.photos/230?1",
        jpg: "https://picsum.photos/230?1",
      },
    },
  };

  const { Story } = defineMeta({
    title: "Components/BandcampAlbum",
    component: BandcampAlbum,
    tags: ["autodocs"],
    args: { album: sampleAlbum },
    argTypes: { album: { control: "object" } },
  });
</script>

<Story name="Default" />
