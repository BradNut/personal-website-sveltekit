<script lang="ts">
	interface Props {
		clazz?: string;
		src: string;
		alt: string;
		width?: number;
		height?: number;
		style?: string;
		loading?: "lazy" | "eager";
	}

	let { clazz = "", src, alt, width, height, style = "", loading = "lazy" }: Props = $props();

	let ref: HTMLImageElement | null | undefined = $state();
	let loaded: boolean = $derived.by(() => {
		if (ref?.complete) return true;
		return false;
	});
</script>

<div class="wrap">
	<img
		class={clazz}
		style={style || undefined}
		{src}
		{alt}
		{width}
		{height}
		{loading}
		decoding="async"
		bind:this={ref}
	/>
	<div class:blur={loaded} class:loaded></div>
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
