<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Image } from '@rodneylab/sveltekit-components';
	export let imageData;
	
	onMount(() => {
		if (browser) {
			document.lazyloadInstance.update();
		}
	});
	const { alt, width, height, src, sources, placeholder, loading } = imageData;
	const sizes = '(max-width: 600px) 500px, (max-width: 500px) 450px, 450px';
</script>

<Image
	{alt}
	{width}
	loading={loading || 'lazy'}
	{height}
	{src}
	{sources}
	{placeholder}
	{sizes}
/>