<script context="module" lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Bandcamp from "./Bandcamp.svelte";

  const sampleAlbums = [
    {
      title: "Album One",
      artist: "Artist A",
      url: "https://example.com",
      artwork: "https://picsum.photos/230?1",
      src: undefined,
    },
    {
      title: "Album Two",
      artist: "Artist B",
      url: "https://example.com",
      artwork: "https://picsum.photos/230?2",
      src: undefined,
    },
    {
      title: "Album Three",
      artist: "Artist C",
      url: "https://example.com",
      artwork: "https://picsum.photos/230?3",
      src: undefined,
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
