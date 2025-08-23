<script lang="ts">
import { ExternalLink } from 'lucide-svelte';
import type { ExternalLinkType, LinkIconType } from '$lib/types/externalLinkTypes';

const { iconData, linkData, textData }: ExternalLinkType = $props();

let textLocationClass = '';
if (textData?.location === 'top') {
  textLocationClass = 'text-top';
} else if (textData?.location === 'bottom') {
  textLocationClass = 'text-bottom';
} else if (textData?.location === 'left') {
  textLocationClass = 'text-left';
} else if (textData?.location === 'right') {
  textLocationClass = 'text-right';
} else {
  textLocationClass = 'text-left';
}

const linkDecoration =
  linkData?.textDecoration && linkData?.textDecoration === 'none' ? `text-decoration-${linkData?.textDecoration}` : 'text-decoration-underline';
const linkClass = `${linkData?.clazz || ''} ${textLocationClass} ${linkDecoration}`.trim();

// Default icon config to satisfy typings when no iconData is provided
const defaultIconData: LinkIconType = { type: 'icon', icon: ExternalLink };
</script>

{#snippet externalLink({ iconData, linkData, textData }: ExternalLinkType)}
	<a
		class={linkClass}
		aria-label={`Open ${linkData?.ariaLabel ?? linkData?.title ?? linkData?.href} externally`}
		title={linkData?.title ?? `Open ${linkData?.ariaLabel} externally`}
		href={linkData.href}
		rel={linkData?.rel ?? "noreferrer"}
		target={linkData?.target ?? "_blank"}
	>
		{#if textData?.location === "top" || (textData?.location === "left" && textData?.text)}
			{textData?.text}
		{/if}
		{#if textData?.showIcon}
			{@render linkIcon(iconData ?? defaultIconData)}
		{/if}
		{#if textData?.location === "bottom" || (textData?.location === "right" && textData?.text)}
			{textData?.text}
		{/if}
	</a>
{/snippet}

{#snippet linkIcon({ type, icon, iconClass }: LinkIconType)}
	{#if type === "svg" && icon && typeof icon === "function" && icon.length !== undefined}
		<svg
			style="width: 2.5rem; height: 2.5rem;"
			class={iconClass ?? ""}
			role="img"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>
				{linkData?.title ?? `Open ${linkData?.ariaLabel} externally`}
			</title>
			{@render (icon as any)()}
		</svg>
	{:else if type === "icon" && icon}
		{@const Icon = icon}
		<Icon><title>{linkData?.title ?? `Open ${linkData?.ariaLabel} externally`}</title></Icon>
	{:else}
		{@const Icon = ExternalLink}
		<Icon><title>{linkData?.title ?? `Open ${linkData?.ariaLabel} externally`}</title></Icon>
	{/if}
{/snippet}

{@render externalLink({ iconData, linkData, textData })}

<style lang="postcss">
	a {
		display: grid;
		place-items: center;
		padding: 0;
		font-size: var(--bodyTextSize);
	}

	.text-top {
		padding-bottom: 0.3rem;
	}

	.text-bottom {
		padding-top: 0.3rem;
	}

	.text-left,
	.text-right {
		display: inline-flex;
		flex-direction: row;
		place-items: baseline;
		place-content: center;
		gap: 0.5rem;
	}

	.text-decoration-none {
		text-decoration: none;
	}

	.text-decoration-underline {
		text-decoration: underline;
		text-decoration-color: var(--shellYellow);
	}

	.show-icon {
		&:hover {
			color: var(--shellYellow);
		}
	}
</style>
