<script context="module" lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import TechStack from "./tech-stack.svelte";

  const { Story } = defineMeta({
    title: "Components/TechStack",
    component: TechStack,
    tags: ["autodocs"],
  });
</script>

<Story name="Default" />
