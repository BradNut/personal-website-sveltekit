<script lang="ts">
  interface Props {
    count?: number;
    classes?: string[];
  }

  let { count = 6, classes = ['columns'] }: Props = $props();
  const placeholders = Array.from({ length: count });
</script>

<div class={classes.join(' ')} role="status" aria-live="polite" aria-busy="true">
  {#each placeholders as _, i (i)}
    <article class="card skeleton">
      <section>
        <h3><span class="skeleton-text skeleton-title" aria-hidden="true">Loading article title...</span></h3>
        <span class="skeleton-text skeleton-domain" aria-hidden="true">Loading domain...</span>
      </section>
      <section>
        <span class="skeleton-text skeleton-reading" aria-hidden="true">Loading reading time...</span>
        <span class="skeleton-text skeleton-tags" aria-hidden="true">Loading tags...</span>
      </section>
    </article>
  {/each}
</div>

<style lang="postcss">
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(250px, 1fr));
    min-height: 800px;

    @media (max-width: 1000px) {
      grid-template-columns: repeat(2, minmax(250px, 1fr));
    }

    @media (max-width: 650px) {
      grid-template-columns: minmax(250px, 1fr);
    }

    gap: 2.5rem;
  }

  .skeleton {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid var(--grey, #e5e7eb);
    background: var(--surface, #0f172a0d);
  }

  .skeleton-text {
    display: block;
    height: 1rem;
    margin: 0.5rem 0;
    border-radius: 6px;
    background: linear-gradient(
      90deg,
      rgba(148, 163, 184, 0.18) 0%,
      rgba(148, 163, 184, 0.35) 50%,
      rgba(148, 163, 184, 0.18) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
  }

  .skeleton-title {
    height: 1.25rem;
    width: 80%;
  }

  .skeleton-domain { width: 40%; }
  .skeleton-reading { width: 55%; }
  .skeleton-tags { width: 65%; }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
