<script lang="ts">
	interface Props {
		rel?: string;
		target?: string;
		href: string;
		ariaLabel: string;
		children?: import("svelte").Snippet;
	}

	let { rel = "", target = "", href, ariaLabel, children }: Props = $props();
</script>

<a aria-label={ariaLabel} {href} {rel} {target}>
	{@render children?.()}
</a>
