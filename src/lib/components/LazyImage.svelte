<script lang="ts">
	import Img from '@zerodevx/svelte-img';
	import type { ExternalImageSource } from '../types/album';

	const { clazz = "", src, alt, style = "", loading = 'lazy' } = $props<{
		clazz?: string;
		src: Record<string, any> | ExternalImageSource[] | undefined;
		alt: string;
		style?: string;
		loading?: 'lazy' | 'eager';
	}>();

	let ref: any = $state();
	let loaded: boolean = $state(false);

	$effect(() => {
		if (ref.complete) {
			loaded = true;
		}
	});
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
