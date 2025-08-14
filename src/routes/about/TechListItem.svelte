<script lang="ts">
	import ExternalLink from '$lib/components/ExternalLink.svelte';
	import { lucideIcon } from '$lib/util/logoIcons.svelte';
	import type { Snippet } from "svelte";
	import type { LinkTextType } from '$lib/types/externalLinkTypes';

	interface Props {
		linkData: LinkTextType;
		ariaLabel: string;
		href: string;
		clazz?: string;
		textData?: LinkTextType;
		icon: Snippet;
	}

	let { ariaLabel, href, clazz = '', textData, icon }: Props = $props();
</script>

<ExternalLink
	linkData={{ href, ariaLabel, clazz }}
	textData={textData}
	iconData={{ type: 'icon', icon }}
/>

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
