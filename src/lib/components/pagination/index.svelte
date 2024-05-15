<script lang="ts">
  import { goto } from '$app/navigation';
  import { Pagination } from "bits-ui";
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  export let additionalClasses: string;
  export let pageSize: number;
  export let totalCount: number;
  export let currentPage: number;
  export let base: string;

  // make some variables
  $: totalPages = Math.ceil(totalCount / pageSize);
  $: prevPage = currentPage - 1;
  $: nextPage = currentPage + 1;
  $: hasNextPage = nextPage <= totalPages;
  $: hasPrevPage = prevPage >= 1;

  $: console.log(hasPrevPage, hasNextPage, prevPage, nextPage, currentPage, totalPages, pageSize);
</script>

<Pagination.Root let:pages count={totalCount} perPage={pageSize} page={currentPage || 1} class={`${additionalClasses}`}
  onPageChange={(page) => goto(`${base}/${page}`)}>
  <Pagination.PrevButton>
    <ChevronLeft />
  </Pagination.PrevButton>
  {#each pages as page (page.key)}
    {#if page.type === "ellipsis"}
      <div class="text-[15px] font-medium text-foreground-alt">...</div>
    {:else}
      <Pagination.Page {page}>
        <a href={`${base}/${page.value}`}>
          {page.value}
        </a>
      </Pagination.Page>
    {/if}
  {/each}
  <Pagination.NextButton>
    <ChevronRight />
  </Pagination.NextButton>
</Pagination.Root>

<style lang="postcss">
  :global([data-pagination-prev-button]) {
    &:hover {
      color: var(--shellYellow);
    }

    &:active {
      transform: scale(0.98); /* Equivalent to active:scale-98 in Tailwind */
    }

    &:disabled {
      cursor: not-allowed; /* Equivalent to disabled:cursor-not-allowed in Tailwind */
      color: #6b7280; /* Equivalent to disabled:text-muted-foreground in Tailwind */
    }

    &:hover:disabled {
      background-color: transparent; /* Equivalent to hover:disabled:bg-transparent in Tailwind */
    }

    border-right: 1px solid var(--grey);
    padding: 1rem;
  }

  :global([data-pagination-next-button]) {
    &:hover {
      color: var(--shellYellow);
    }

    &:active {
      transform: scale(0.98); /* Equivalent to active:scale-98 in Tailwind */
    }

    &:disabled {
      cursor: not-allowed; /* Equivalent to disabled:cursor-not-allowed in Tailwind */
      color: #6b7280; /* Equivalent to disabled:text-muted-foreground in Tailwind */
    }

    &:hover:disabled {
      background-color: transparent; /* Equivalent to hover:disabled:bg-transparent in Tailwind */
    }
  }

  :global([data-selected]) {
    a {
      color: var(--shellYellow);
    }
  }

	:global([data-pagination-root]) {
		display: flex;
		align-content: center;
		align-items: center;
		justify-items: center;
		border: 1px solid var(--grey);
		margin: 3rem 0;
		border-radius: 5px;
		text-align: center;
		font-size: 1.5rem;
	}

  :global([data-pagination-page]) {
    padding: 1rem;
    flex: 1;
    border-right: 1px solid var(--grey);
    text-decoration: none;

    a {
      text-decoration: none;
    }
  }
</style>