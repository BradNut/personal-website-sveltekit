<script lang="ts">
  import ExternalLink from "$lib/components/ExternalLink.svelte";
  import type { Snippet } from "svelte";
  import type { LinkTextType } from "$lib/types/externalLinkTypes";

  interface Props {
    ariaLabel: string;
    href: string;
    clazz?: string;
    textData?: LinkTextType;
    icon: Snippet;
  }

  let { ariaLabel, href, clazz = "", textData, icon }: Props = $props();
  // Ensure a stable class for styling
  const mergedClazz = `${clazz} tech-list-item`.trim();
</script>

<ExternalLink
  linkData={{ href, ariaLabel, clazz: mergedClazz }}
  {textData}
  iconData={{ type: "svg", icon }}
/>

<style lang="postcss">
  /* Style the link rendered inside ExternalLink via a specific class */
  :global(a.tech-list-item) {
    display: grid;
    justify-items: center;
    font-weight: bold;
    margin-right: 0;
    text-decoration: none;
    padding: 0.3rem;
    margin-left: 1rem;
    color: var(--lightGrey);
  }

  :global(a.tech-list-item p) {
    font-size: 1.5rem;
    padding-top: 0.3rem;
    margin: 0;
  }

  :global(a.tech-list-item:hover) {
    color: var(--shellYellow);
  }

  :global(a.tech-list-item:hover p) {
    color: var(--shellYellow);
  }

  :global(a.tech-list-item svg) {
    color: white;
  }
</style>
