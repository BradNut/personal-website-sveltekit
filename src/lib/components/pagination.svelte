<script lang="ts">
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";
  import { Pagination } from "bits-ui";
  import { goto } from "$app/navigation";

  interface Props {
    additionalClasses: string;
    pageSize: number;
    totalCount: number;
    currentPage: number;
    totalPages: number;
    base: string;
  }

  let { additionalClasses, pageSize, totalCount, currentPage, base }: Props =
    $props();
</script>

<Pagination.Root
  count={totalCount}
  perPage={pageSize}
  page={currentPage || 1}
  class={`${additionalClasses}`}
  aria-label="Pagination"
  onPageChange={(page) => goto(`${base}/${page}`)}
>
  {#snippet children({ pages })}
    <Pagination.PrevButton
      aria-label="Previous page"
      data-umami-event="Pagination"
      data-umami-event-action="Previous"
    >
      <ChevronLeft />
    </Pagination.PrevButton>
    {#each pages as page (page.key)}
      {#if page.type === "ellipsis"}
        <div class="ellipsis text-[15px] font-medium text-foreground-alt">
          ...
        </div>
      {:else}
        <Pagination.Page {page}>
          {#snippet child({ props })}
            <button
              {...props}
              type="button"
              aria-label={`Go to page ${page.value}`}
              aria-current={props["data-selected"] === undefined ? undefined : "page"}
              data-umami-event="Pagination"
              data-umami-event-action={`Page ${page.value}`}
            >
              {page.value}
            </button>
          {/snippet}
        </Pagination.Page>
      {/if}
    {/each}
    <Pagination.NextButton
      aria-label="Next page"
      data-umami-event="Pagination"
      data-umami-event-action="Next"
    >
      <ChevronRight />
    </Pagination.NextButton>
  {/snippet}
</Pagination.Root>

<style lang="postcss">
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
    font-weight: 400;
  }

  :global([data-pagination-prev]),
  :global([data-pagination-next]),
  :global([data-pagination-page]) {
    padding: 1rem;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover:not(:disabled),
    &[data-selected] {
      background-color: var(--shellYellow);
      color: var(--black);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:disabled {
      cursor: not-allowed;
      color: #6b7280;
    }
  }

  /* Keep the hover fill inside the root's rounded corners (5px minus its 1px border). */
  :global([data-pagination-prev]) {
    border-right: 1px solid var(--grey);
    border-radius: 4px 0 0 4px;
  }

  :global([data-pagination-next]) {
    border-radius: 0 4px 4px 0;
  }

  :global([data-pagination-page]) {
    flex: 1;
    border-right: 1px solid var(--grey);
    text-decoration: none;

    &[data-selected] {
      font-weight: 700;
    }
  }

  :global(.ellipsis) {
    padding: 1rem;
    border-right: 1px solid var(--grey);
  }
</style>
