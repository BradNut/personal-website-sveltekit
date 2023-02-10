<script lang="ts">
  export let additionalClasses: string;
  export let pageSize: number;
  export let totalCount: number;
  export let currentPage: number;
  export let skip: number;
  export let base: string;

  // make some variables
  console.log(`Total count: ${totalCount}`);
  console.log(`Page Size: ${pageSize}`);
  const totalPages = Math.ceil(totalCount / pageSize);
  console.log(`Total Pages: ${totalPages}`)
  console.log(`Current Page: ${currentPage} and type: ${typeof currentPage}`)
  let prevPage = currentPage - 1;
  console.log(`PrevPage: ${prevPage}`)
  console.log(`Pagination current Page: ${currentPage}`)
  let nextPage = currentPage + 1;
  let hasNextPage = nextPage <= totalPages;
  let hasPrevPage = prevPage >= 1;
  console.log({ nextPage, hasNextPage, hasPrevPage })
</script>

<div class={`paginationStyles ${additionalClasses}`}>
  <a
    title={`${!hasPrevPage ? 'No ' : ''}Prev Page`}
    aria-disabled={!hasPrevPage}
    href={`${base}/${prevPage}`}
  >
    &#8592; <span class="word">Prev</span>
  </a>
  {#each { length: totalPages } as _, i}
    <a
      aria-current={currentPage === i + 1}
      href={`${base}/${i + 1}`}
    >
      {i + 1}
    </a>
  {/each}
  <a
    title={`${!hasNextPage ? 'No ' : ''}Next Page`}
    aria-disabled={!hasNextPage}
    href={`${base}/${nextPage}`}
  >
    <span class="word">Next</span> &#8594;
  </a>
</div>

<style lang="postcss">
  a {
    &[aria-current="true"] {
      color: var(--shellYellow)
    }

    &[aria-disabled="true"] {
      pointer-events: none;
      color: var(--lightGrey);
      text-decoration: line-through;
    }
  }

	.paginationStyles {
		display: flex;
		align-content: center;
		align-items: center;
		justify-items: center;
		border: 1px solid var(--grey);
		margin: 3rem 0;
		border-radius: 5px;
		text-align: center;
		font-size: 1.5rem;

		& > * {
			padding: 1rem;
			flex: 1;
			border-right: 1px solid var(--grey);
			text-decoration: none;
		}
		@media (max-width: 800px) {
			.word {
				display: none;
			}
		}
	}
</style>