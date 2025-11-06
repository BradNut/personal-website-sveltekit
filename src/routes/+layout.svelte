<script lang="ts">
import '../styles/styles.pcss';
import { MetaTags } from 'svelte-meta-tags';
import { dev } from '$app/environment';
import { page } from '$app/state';
import Header from '../lib/components/header/index.svelte';
import Footer from '../lib/components/footer/index.svelte';
import Analytics from '../lib/components/analytics/index.svelte';
import { onNavigate } from '$app/navigation';
import PageLoadingIndicator from '../lib/util/page_loading_indicator.svelte';

interface Props {
  children?: import('svelte').Snippet;
}

let { children }: Props = $props();

const production = !dev || import.meta.env.NODE_ENV !== 'production';

onNavigate(async (navigation) => {
  if (!document.startViewTransition) return;

  return new Promise((oldStateCaptureResolve) => {
    document.startViewTransition(async () => {
      oldStateCaptureResolve();
      await navigation.complete;
    });
  });
});

let metaTags = $derived({
  titleTemplate: '%s | Bradley Shellnut',
  additionalMetaTags: [
    {
      property: 'theme-color',
      content: '#272727',
    },
  ],
  ...page.data.metaTagsChild,
});
</script>

{#if production}
	<Analytics />
{/if}

<PageLoadingIndicator />
<MetaTags {...metaTags} />

<div class="wrapper">
	<Header />
	<main>
		{@render children?.()}
	</main>
	<Footer />
</div>

<style lang="postcss">
	.wrapper {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
	}

	main {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		padding: 2rem 0rem;
		max-width: 85vw;

		@media (width >= 1600px) {
			max-width: 60vw;
		}

		box-sizing: border-box;
	}

	:global(p) {
		word-wrap: normal;
		font-size: var(--bodyTextSize);
		color: var(--lightShade);
	}

	:global(li) {
		word-wrap: normal;
		font-size: var(--bodyTextSize);
		color: var(--lightShade);
	}
</style>
