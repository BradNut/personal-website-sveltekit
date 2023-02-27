<script lang="ts">
	export let rel = '';
	export let target = '';
	export let href: string;
	export let ariaLabel: string;
</script>

<a aria-label={ariaLabel} {href} {rel} {target}>
	<slot />
</a>