<script lang="ts">
import type { LayoutData } from './$types';

interface Props {
  data: LayoutData;
  children: import('svelte').Snippet;
}

let { children }: Props = $props();
</script>

<div class="articles-layout">
  <h1 style:margin-bottom="2rem">Favorite Tech Articles</h1>
  {@render children()}
</div>

<style>
  .articles-layout {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-weight: 700;
    color: var(--color-theme-1);
    text-align: center;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-theme-1);
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
