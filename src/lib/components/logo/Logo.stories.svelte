<script context="module" lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Logo from "./index.svelte";

  const { Story } = defineMeta({
    title: "Components/Logo",
    component: Logo,
    tags: ["autodocs"],
  });
</script>

<Story name="Default" />
