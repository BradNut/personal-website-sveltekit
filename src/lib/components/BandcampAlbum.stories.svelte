<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import BandcampAlbum from "./BandcampAlbum.svelte";
  import type { Album } from "$lib/types/album";

  export const sampleAlbum: Album = {
    title: "Album One",
    artist: "Artist A",
    url: "https://example.com",
    src: "https://picsum.photos/230?1",
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
