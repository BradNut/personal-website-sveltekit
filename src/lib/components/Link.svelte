<script lang="ts">
	const { rel = '', target = '', href, ariaLabel } = $props<{
		rel?: string;
		target?: string,
		href: string,
		ariaLabel: string
	}>();
</script>

<a aria-label={ariaLabel} {href} {rel} {target}>
	<slot />
</a>