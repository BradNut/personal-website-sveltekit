<script lang="ts">
	import OpenInNew from '@iconify-icons/mdi/open-in-new';
	import type { IconifyIcon } from 'iconify-icon';
	export let rel = 'noreferrer';
	export let target = '_blank';
	export let href: string;
	export let ariaLabel: string;
	export let showIcon: boolean = false;
	export let icon: IconifyIcon = OpenInNew;
</script>

<span class:show-icon={showIcon}>
	<a aria-label={`Open ${ariaLabel} externally`} title={`Open ${ariaLabel} externally`} {href} {rel} {target}>
			<slot />
	</a>
	{#if showIcon}
		<iconify-icon {icon} width="24" height="24" role="img" title={`Open ${ariaLabel} Externally`} />
	{/if}
</span>

<style lang="postcss">
	.show-icon {
		display: inline-flex;
		gap: 0.5rem;

		&:hover {
			color: var(--shellYellow);
		}
	}
</style>