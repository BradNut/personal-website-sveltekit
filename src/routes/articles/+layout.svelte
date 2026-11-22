<script lang="ts">
  import type { LayoutData } from "./$types";

  interface Props {
    data: LayoutData;
    children: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="articles-layout">
  <h1 style:margin-bottom="2rem">Favorite Tech Articles</h1>
  {@render children()}
</div>

<style>
  .articles-layout {
    /* Ask for the full 1200px and let <main>'s own max-width cap it, instead of shrinking to the
       widest article card: the column, and the pagination bar in it, stays the same width on every page. */
    width: 1200px;
    max-width: 100%;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
  }

  :global(.top-pagination) {
    margin-bottom: 2rem;
  }

  :global(.bottom-pagination) {
    margin-top: 2rem;
  }
</style>
