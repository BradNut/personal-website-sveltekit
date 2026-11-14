<script context="module" lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import LazyImage from "./LazyImage.svelte";

  const { Story } = defineMeta({
    title: "Components/LazyImage",
    component: LazyImage,
    tags: ["autodocs"],
    args: {
      clazz: "demo-image",
      src: "https://picsum.photos/400/300",
      width: 400,
      height: 300,
      alt: "Random image",
      style: "",
      loading: "lazy",
    },
    argTypes: {
      clazz: { control: "text" },
      src: { control: "text" },
      width: { control: "number" },
      height: { control: "number" },
      alt: { control: "text" },
      style: { control: "text" },
      loading: { control: { type: "select" }, options: ["lazy", "eager"] },
    },
  });
</script>

<Story name="Default" />
