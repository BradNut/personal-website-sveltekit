<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		ariaLabel: string;
		href: string;
		clazz?: string;
		itemText: string;
		icon?: Snippet;
		children?: any;
	}

	let { ariaLabel, href, clazz = '', itemText, icon, children }: Props = $props();
</script>

<a
	target="_blank"
	rel="noreferrer"
	aria-label={ariaLabel}
	{href}
	class={clazz}
>
	{#if icon}
		{@render icon?.()}
	{/if}
	{@render children?.()}
	<p>{itemText}</p>
</a>

<style lang="postcss">
	a {
		display: grid;
		justify-items: center;

		font-weight: bold;
		margin-right: 0;
		text-decoration: none;
		padding: 0.3rem;
		margin-left: 1rem;
		color: var(--lightGrey);

		& p {
			font-size: 1.5rem;
			padding-top: 0.3rem;
			margin: 0;
		}

		&:hover {
			color: var(--shellYellow);
			& p {
				color: var(--shellYellow);
			}
		}
	}

	svg {
		color: white;
	}
</style>
