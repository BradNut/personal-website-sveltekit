<script lang="ts">
  import { techStack } from '$lib/shared/techStack';
</script>

<div class="tech-list">
  {#each techStack as entry (entry.label)}
    <a
      href={entry.href}
      aria-label={entry.label}
      title={entry.label}
      target="_blank"
      rel="noopener noreferrer"
      class="tech-list-item"
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path fill="currentColor" d={entry.iconPath} />
      </svg>
      <span>{entry.label}</span>
    </a>
  {/each}
</div>

<style lang="postcss">
  .tech-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    place-content: center;
    gap: 2rem;
    margin-top: 2rem;
    font-size: 2rem;

    @media (max-width: 768px) {
      gap: 1.5rem;
      font-size: 1.8rem;
    }

    @media (max-width: 480px) {
      gap: 1rem;
      font-size: 1.5rem;
    }
  }

  .tech-list-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    text-decoration: none;

    &:hover {
      color: var(--shellYellow);
    }

    & svg {
      width: 1em;
      height: 1em;
    }
  }
</style>
