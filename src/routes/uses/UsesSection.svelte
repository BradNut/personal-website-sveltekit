<script lang="ts">
	import { ChevronDown } from "@lucide/svelte";
	import { Accordion } from "bits-ui";
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
		id?: string;
		title: string;
		value: string;
	}

	let { children, id, title, value }: Props = $props();
</script>

<Accordion.Item {value}>
	<Accordion.Header level={2}>
		<Accordion.Trigger>
			{#snippet child({ props }: { props: Record<string, unknown> })}
				<button {...props} class="uses-trigger">
					{title}
					<span class="uses-chevron" aria-hidden="true">
						<ChevronDown />
					</span>
				</button>
			{/snippet}
		</Accordion.Trigger>
	</Accordion.Header>
	<Accordion.Content hiddenUntilFound>
		{#snippet child({ props }: { open: boolean; props: Record<string, unknown> })}
			<div {...props} class="uses-content">
				<section {id}>
					{@render children()}
				</section>
			</div>
		{/snippet}
	</Accordion.Content>
</Accordion.Item>

<style lang="postcss">
	.uses-trigger {
		width: 100%;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		font-family: var(--headingFont);
		font-size: var(--h2);
		color: var(--white);
		background: transparent;
		border: 1px solid var(--lineColor);
		border-radius: var(--borderRadius);
		cursor: pointer;
		text-align: left;
		transition: color 0.2s ease, border-color 0.2s ease;

		&:hover {
			color: var(--linkHover);
			border-color: var(--linkHover);
		}
	}

	.uses-chevron {
		flex-shrink: 0;
		transition: transform 0.2s ease;
	}

	.uses-trigger[data-state="open"] .uses-chevron {
		transform: rotate(180deg);
	}

	.uses-content {
		padding: 1rem;
	}

	section {
		/* Keep the existing section flow intact */
	}
</style>
