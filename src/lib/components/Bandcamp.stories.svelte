<script context="module" lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Bandcamp from "./Bandcamp.svelte";
  import type { Album } from "$lib/types/album";
  import { sampleAlbum as baseAlbum } from "./BandcampAlbum.stories.svelte";

  const sampleAlbums: Album[] = [
    { ...baseAlbum, title: "Album One", artwork: "https://picsum.photos/230?1" },
    { ...baseAlbum, title: "Album Two", artwork: "https://picsum.photos/230?2" },
    { ...baseAlbum, title: "Album Three", artwork: "https://picsum.photos/230?3" },
  ];

  const { Story } = defineMeta({
    title: "Components/Bandcamp",
    component: Bandcamp,
    tags: ["autodocs"],
    args: { albums: sampleAlbums },
    argTypes: { albums: { control: "object" } },
  });
</script>

<Story name="Default" />
