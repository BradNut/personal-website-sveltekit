<script context="module" lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Album } from "$lib/types/album";
  import Bandcamp from "./Bandcamp.svelte";
  import { sampleAlbum as baseAlbum } from "./BandcampAlbum.stories.svelte";

  const sampleAlbums: Album[] = [
    {
      ...baseAlbum,
      title: "Album One",
      artwork: "https://picsum.photos/230?1",
    },
    {
      ...baseAlbum,
      title: "Album Two",
      artwork: "https://picsum.photos/230?2",
    },
    {
      ...baseAlbum,
      title: "Album Three",
      artwork: "https://picsum.photos/230?3",
    },
    {
      ...baseAlbum,
      title: "Album Four",
      artwork: "https://picsum.photos/230?4",
    },
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
