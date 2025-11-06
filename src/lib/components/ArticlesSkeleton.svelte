<script lang="ts">
interface Props {
  count?: number;
  classes?: string[];
}

let { count = 6, classes = [''] }: Props = $props();
const placeholders = Array.from({ length: count });
</script>

{#each placeholders as _, i (i)}
  <article class={`card skeleton ${classes.join(" ")}`}>
    <section>
      <h3>
        <span class="skeleton-text skeleton-title"
          >Loading article title...</span
        >
      </h3>
      <p>
        <span class="skeleton-text skeleton-domain">Loading domain...</span>
      </p>
    </section>
    <section>
      <p>
        <span class="skeleton-text skeleton-reading"
          >Loading reading time...</span
        >
      </p>
      <p>
        <span class="skeleton-text skeleton-tags">Loading tags...</span>
      </p>
    </section>
  </article>
{/each}

<style lang="postcss">
  p {
    min-height: 1em;
    line-height: 1.2;
    padding: 0.25rem 0.5rem;
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
    min-height: 1.25em;
    line-height: 1.25em;
    padding: 0.25rem 0.5rem;
    color: transparent; /* hide placeholder text */
    overflow: hidden;
  }

  .skeleton-title {
    height: 1.6em;
  }

  .skeleton-domain {
    width: 40%;
    height: 1.25em;
  }

  .skeleton-reading {
    width: 55%;
    height: 1.25em;
    margin-top: 0.25rem;
  }

  .skeleton-tags {
    width: 65%;
    height: 1.6em; /* closer to tag chip height */
    border-radius: 9999px; /* pill-like to match tags */
  }

  /* layout tweaks to avoid overlap and match spacing */
  .card.skeleton {
    align-items: start;
  }
  .skeleton > section {
    display: grid;
    gap: 0.5rem;
  }
  .skeleton > section + section {
    margin-top: 0.75rem;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
</style>
