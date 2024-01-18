<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import NProgress from "nprogress";
	import 'iconify-icon';
	import { browser } from "$app/environment";
	import { navigating, page } from "$app/stores";
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import "nprogress/nprogress.css";
	import '$root/styles/styles.pcss';
	import { setLanguageTag, sourceLanguageTag, type AvailableLanguageTag } from "$paraglide/runtime";
	import Header from '$lib/components/header/index.svelte';
	import Footer from '$lib/components/footer/index.svelte';
	import Analytics from '$lib/components/analytics/index.svelte';
	import { getTextDirection } from '$root/lib/i18n-routing';
	import I18NHeader from '$root/lib/I18NHeader.svelte';

	NProgress.configure({
			// Full list: https://github.com/rstacruz/nprogress#configuration
			minimum: 0.16,
	});

	const dev = process.env.NODE_ENV !== 'production';
	const siteUrl = PUBLIC_SITE_URL || 'https://bradleyshellnut.com/';

	$: {
		if (browser && $navigating) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	}

	$: metaTags = {
		titleTemplate: '%s | Bradley Shellnut',
		additionalMetaTags: [
			{
				property: 'theme-color',
				content: '#272727'
			}
		],
		...$page.data.metaTagsChild
	}

	// Determine the current language from the URL. Fall back to the source language if none is specified.
	$: lang = $page.params.lang as AvailableLanguageTag ?? sourceLanguageTag

	console.log('lang', lang)

	// Set the language tag in the Paraglide runtime.
	// This determines which language the strings are translated to.
	// You should only do this in the template, to avoid concurrent requests interfering with each other.
	$: setLanguageTag(lang)


	// Determine the text direction of the current language
	$: textDirection = getTextDirection(lang)

	// Keep the <html> lang and dir attributes in sync with the current language
	$: if (browser) {
		document.documentElement.dir = textDirection
		document.documentElement.lang = lang
	}
</script>

{#if !dev}
	<Analytics />
{/if}

<MetaTags {...metaTags} />

<I18NHeader />

<div class="wrapper">
	{#key lang}
		<Header />
		<main>
			<slot />
		</main>
		<Footer />
	{/key}
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