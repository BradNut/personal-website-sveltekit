<script lang="ts">
	import { onMount } from 'svelte';
	import Img from '@zerodevx/svelte-img';
	import type { ExternalImageSource } from '../types/album';

	export let clazz = "";
	export let src: Record<string, any> | ExternalImageSource[] | undefined;
	export let alt: string;
	export let style = "";
	export let loading: "lazy" | "eager" = "lazy";

	let ref: any;
	let loaded: boolean;

	onMount(() => {
		if (ref.complete)	{
			loaded = true;
		}
	})
</script>

<div class="wrap">
	<Img class={clazz} {style} {src} {alt} {loading} bind:ref on:load={() => (loaded = true)} />
	<div class:blur={loaded} class:loaded />
</div>

<style lang="postcss">
	.wrap {
		position: relative;
		overflow: hidden;
	}

	.blur {
		position: absolute;
		inset: 0;
		backdrop-filter: blur(20px);
		pointer-events: none;
	}

	.loaded {
		display: none;
	}
</style>
