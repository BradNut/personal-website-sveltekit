<script context="module" lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import TechStack from "./TechStack.svelte";

  const { Story } = defineMeta({
    title: "Components/TechStack",
    component: TechStack,
    tags: ["autodocs"],
  });
</script>

<Story name="Default" />
