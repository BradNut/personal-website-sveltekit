<script lang="ts">
  import { navigating } from "$app/state";
  import Articles from "$lib/components/Articles.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  // Use the data directly - it will be reactive when navigating between pages
  let articles = $derived(data?.articles || []);
  let currentPage: number = $derived(data?.currentPage || 1);
  let totalArticles: number = $derived(data?.totalArticles || 0);
  let limit: number = $derived(data?.limit || 10);
  let totalPages: number = $derived(data?.totalPages || 1);

  // Skeleton only while navigating to another articles page (slow data refetch),
  // never on navigations to unrelated routes.
  let loading = $derived(
    navigating.to?.route.id === "/articles/[page]" &&
      navigating.to?.params?.page !== String(currentPage),
  );
</script>

<div class="articles-content">
  <Pagination
    additionalClasses="top-pagination"
    pageSize={limit}
    totalCount={totalArticles}
    currentPage={currentPage || 1}
    totalPages={totalPages || 1}
    base="/articles"
  />

  <Articles
    data={{
      articles,
      totalArticles,
      classes: ["columns"],
      compact: false,
      loading,
    }}
  />

  <Pagination
    additionalClasses="bottom-pagination"
    pageSize={limit}
    totalCount={totalArticles}
    currentPage={currentPage || 1}
    totalPages={totalPages || 1}
    base="/articles"
  />
</div>

<style>
  .articles-content {
    width: 100%;
  }

  :global(.top-pagination) {
    margin-bottom: 2rem;
  }

  :global(.bottom-pagination) {
    margin-top: 2rem;
  }
</style>
