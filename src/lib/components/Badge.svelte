<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'default' | 'secondary' | 'outline' | 'destructive';

	interface Props {
		variant?: Variant;
		href?: string;
		class?: string;
		children?: Snippet;
	}

	let { variant = 'default', href, class: className = '', children }: Props = $props();
</script>

{#if href}
	<a {href} class="badge badge-{variant} {className}">
		{@render children?.()}
	</a>
{:else}
	<span class="badge badge-{variant} {className}">
		{@render children?.()}
	</span>
{/if}

<style lang="postcss">
	.badge {
		display: inline-flex;
		align-items: center;
		border-radius: 2px;
		padding: 0.25rem 0.5rem;
		font-size: 1.2rem;
		font-weight: 800;
		transition: all 0.2s;
		text-decoration: none;
	}

	.badge-default {
		background-color: var(--linkHover);
		color: var(--buttonTextColor);
	}

	.badge-secondary {
		background-color: var(--cardBg);
		color: var(--textColor);
	}

	.badge-outline {
		background-color: transparent;
		color: var(--linkHover);
		border: 1px solid var(--linkHover);
	}

	.badge-destructive {
		background-color: #ef4444;
		color: var(--white);
	}
</style>
