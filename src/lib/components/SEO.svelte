<script lang="ts">
	import { PUBLIC_SITE_URL } from "$env/static/public";
	const siteUrl = PUBLIC_SITE_URL || 'https://bradleyshellnut.com';

  const defaultMetadata = {
    defaultTitle: 'Bradley Shellnut',
    defaultDescription: "My name is Bradley Shellnut and I'm a Full Stack Software Engineer.",
    defaultImage: '/b_shell_nut_favicon.png',
    siteUrl,
  };

	export let title = defaultMetadata.defaultTitle;
	export let description = defaultMetadata.defaultDescription;
	export let image = defaultMetadata.defaultImage;
	export let location: string = '';

  $: seo = {
    title,
    description,
    image: `${siteUrl}${image}`,
    url: `${siteUrl}${location || ``}`,
  };
</script>

<svelte:head>
	<title>{`${seo.title} | ${defaultMetadata.defaultTitle}`}</title>
	<link rel="icon" type="image/gif" href="/b_shell_nut_favicon.gif" />
	<meta name="description" content={seo.description} />
	<meta name="og:type" content="website" />
	<meta name="og:title" content={seo.title} />
	{#if seo.url}
		<meta name="og:url" content={seo.url} />
	{/if}
	<meta name="og:description" content={seo.description} />
	<meta name="og:site_name" content={seo.title} />
	<meta name="og:image" content={seo.image || '/b_shell_nut_favicon.png'} />
	<meta name="og:locale" content="en_US" />
	<meta name="twitter:card" content="summary" />
	<!-- <meta name="twitter:site" content="@" /> -->
	<!-- <meta name="twitter:creator" content="@" /> -->
	{#if seo.url}
		<meta name="twitter:url" content={seo.url} />
	{/if}
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta
		name="twitter:image"
		content={seo.image || '/b_shell_nut_favicon.png'}
	/>
	<meta name="theme-color" content="#272727" />
</svelte:head>
