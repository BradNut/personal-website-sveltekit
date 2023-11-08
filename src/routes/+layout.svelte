<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import NProgress from "nprogress";
	import 'iconify-icon';
	import { browser } from "$app/environment";
	import { navigating, page } from "$app/stores";
	import "nprogress/nprogress.css";
	import '$root/styles/styles.pcss';
	import Header from '$lib/components/header/index.svelte';
	import Footer from '$lib/components/footer/index.svelte';
	import Analytics from '$lib/components/analytics/index.svelte';
	// import SEO from '$lib/components/SEO.svelte';

	NProgress.configure({
			// Full list: https://github.com/rstacruz/nprogress#configuration
			minimum: 0.16,
	});

	export let data;

	const dev = process.env.NODE_ENV !== 'production';

	$: {
		if (browser && $navigating) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	}

	$: metaTags = {
		titleTemplate: '%s | Bradley Shellnut',
		description: 'My name is Bradley Shellnut and I\'m a Full Stack Software Engineer.',
		openGraph: {
			type: 'website',
			titleTemplate: '%s | Bradley Shellnut',
			locale: 'en_US',
			description: 'My name is Bradley Shellnut and I\'m a Full Stack Software Engineer.',
		},
		...$page.data.metaTagsChild
	}
</script>

{#if !dev}
	<Analytics />
{/if}

<MetaTags {...metaTags} />

<!-- <SEO /> -->

<div class="wrapper">
	<Header />
	<main>
		<slot />
	</main>
	<Footer />
</div>

<style lang="postcss">
	.loading {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 101;
		display: grid;
		place-items: center;
		gap: 1rem;

		& h3 {
			color: white;
		}
	}

	.background {
		background: black;
		opacity: 0.8;
		cursor: none;
		inset: 0;
		position: fixed;
		z-index: 100;
	}

	.wrapper {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		padding: 2rem 0rem;
		max-width: 85vw;

		@media (min-width: 1600px) {
			max-width: 60vw;
		}

		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
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