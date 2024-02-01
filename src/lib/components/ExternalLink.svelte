<script lang="ts">
	import OpenInNew from '@iconify-icons/mdi/open-in-new';
	import type { IconifyIcon } from 'iconify-icon';

	const { rel = 'noreferrer', target = '_blank', href, ariaLabel, showIcon = false, clazz = "", icon = OpenInNew } = $props<{
		rel?: string;
		target?: string;
		href: string;
		ariaLabel: string;
		showIcon?: boolean;
		clazz?: string;
		icon?: IconifyIcon;
	}>();
</script>


<a class:show-icon={showIcon} class={clazz} aria-label={`Open ${ariaLabel} externally`} title={`Open ${ariaLabel} externally`} {href} {rel} {target}>
	<slot />
	{#if showIcon}
		<iconify-icon {icon} width="24" height="24" role="img" title={`Open ${ariaLabel} Externally`} />
	{/if}
</a>

<style lang="postcss">
	.show-icon {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;

		&:hover {
			color: var(--shellYellow);
		}
	}
</style>