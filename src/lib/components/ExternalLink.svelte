<script lang="ts">
	import OpenInNew from '@iconify-icons/mdi/open-in-new';
	import type { IconifyIcon } from 'iconify-icon';
	interface Props {
		rel?: string;
		target?: string;
		href: string;
		ariaLabel: string;
		showIcon?: boolean;
		clazz?: string;
		icon?: IconifyIcon;
		children?: import('svelte').Snippet;
	}

	let {
		rel = 'noreferrer',
		target = '_blank',
		href,
		ariaLabel,
		showIcon = false,
		clazz = "",
		icon = OpenInNew,
		children
	}: Props = $props();
</script>


<a class:show-icon={showIcon} class={clazz} aria-label={`Open ${ariaLabel} externally`} title={`Open ${ariaLabel} externally`} {href} {rel} {target}>
	{@render children?.()}
	{#if showIcon}
		<iconify-icon {icon} width="24" height="24" role="img" title={`Open ${ariaLabel} Externally`}></iconify-icon>
	{/if}
</a>

<style lang="postcss">
	a {
		margin: 1rem 0;
		padding: 0;
		font-size: var(--bodyTextSize);
	}

	.show-icon {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;

		&:hover {
			color: var(--shellYellow);
		}
	}
</style>