<script lang="ts">
	import { ExternalLink,type Icon as IconType } from 'lucide-svelte';

	interface Props {
		rel?: string;
		target?: string;
		href: string;
		ariaLabel: string;
		showIcon?: boolean;
		clazz?: string;
		icon?: typeof IconType | string;
		children?: import('svelte').Snippet;
	}

	let { rel = 'noreferrer', target = '_blank', href, ariaLabel, showIcon = false, clazz = '', icon = ExternalLink, children }: Props = $props();
</script>


<a class:show-icon={showIcon} class={clazz} aria-label={`Open ${ariaLabel} externally`} title={`Open ${ariaLabel} externally`} {href} {rel} {target}>
	{@render children?.()}
	{#if showIcon}
		{#if typeof icon === 'string'}
			{@html icon}
		{:else}
			{@const Icon = icon}
			<Icon />
		{/if}
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