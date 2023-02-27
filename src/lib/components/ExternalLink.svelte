<script lang="ts">
	import OpenInNew from '@iconify-icons/mdi/open-in-new';
	export let rel = 'noreferrer';
	export let target = '_blank';
	export let href: string;
	export let ariaLabel: string;
	export let showIcon: boolean = false;
</script>

<span class:show-icon={showIcon}>
	<a aria-label={`Open ${ariaLabel} externally`} title={`Open ${ariaLabel} externally`} {href} {rel} {target}>
			<slot />
	</a>
	{#if showIcon}
		<iconify-icon icon={OpenInNew} width="24" height="24" role="img" title={`Open ${ariaLabel} Externally`} />
	{/if}
</span>

<style lang="postcss">
	.show-icon {
		display: flex;
		gap: 0.5rem;
		place-items: center;

		&:hover {
			color: var(--shellYellow);
		}
	}
</style>