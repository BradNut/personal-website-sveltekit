<script lang="ts">
	import { run } from 'svelte/legacy';

	import { MetaTags } from 'svelte-meta-tags';
	import NProgress from "nprogress";
	import 'iconify-icon';
	import { browser } from "$app/environment";
	import { navigating, page } from "$app/stores";
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import "nprogress/nprogress.css";
	import '$root/styles/styles.pcss';
	import Header from '$lib/components/header/index.svelte';
	import Footer from '$lib/components/footer/index.svelte';
	import Analytics from '$lib/components/analytics/index.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	NProgress.configure({
			// Full list: https://github.com/rstacruz/nprogress#configuration
			minimum: 0.16,
	});

	const dev = process.env.NODE_ENV !== 'production';
	const siteUrl = PUBLIC_SITE_URL || 'https://bradleyshellnut.com/';


	if (browser && $navigating) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	}

	let metaTags = $derived({
		titleTemplate: '%s | Bradley Shellnut',
		additionalMetaTags: [
			{
				property: 'theme-color',
				content: '#272727'
			}
		],
		...$page.data.metaTagsChild
	})
</script>

{#if !dev}
	<Analytics />
{/if}

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

	:global(#nprogress .bar) {
		background: var(--lightGrey);
	}

	:global(#nprogress .spinner-icon) {
		border-top-color: var(--lightGrey);
		border-left-color: var(--lightGrey);
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