<script lang="ts">
	import { ExternalLink } from "lucide-svelte";
	import type {
		ExternalLinkType,
		LinkIconType,
	} from "$lib/types/externalLinkTypes";

	const {
		iconData = { type: "icon", icon: ExternalLink },
		linkData,
		textData,
		iconSize = 20,
	}: ExternalLinkType & { iconSize?: number } = $props();
	// Guarantee non-optional icon data for linkIcon()
	const safeIconData: LinkIconType = $derived(
		iconData ?? {
			type: "icon",
			icon: ExternalLink,
		},
	);

	const textLocationClass = $derived.by(() => {
		if (textData?.location === "top") {
			return "text-top";
		} else if (textData?.location === "bottom") {
			return "text-bottom";
		} else if (textData?.location === "left") {
			return "text-left";
		} else if (textData?.location === "right") {
			return "text-right";
		} else {
			return "text-left";
		}
	});

	const linkDecoration = $derived(
		linkData?.textDecoration && linkData?.textDecoration === "none"
			? `text-decoration-${linkData?.textDecoration}`
			: "text-decoration-underline",
	);
	const linkClass = $derived(
		`${linkData?.clazz || ""} ${textLocationClass} ${linkDecoration}`.trim(),
	);
</script>

{#snippet externalLink({
	iconData = { type: "icon", icon: ExternalLink },
	linkData,
	textData,
}: ExternalLinkType)}
	<a
		class={linkClass}
		aria-label={`Open ${linkData?.ariaLabel ?? linkData?.title ?? linkData?.href} externally`}
		title={linkData?.title ?? `Open ${linkData?.ariaLabel} externally`}
		href={linkData.href}
		rel={linkData?.rel ?? "noreferrer"}
		target={linkData?.target ?? "_blank"}
		data-umami-event={linkData?.trackingEvent ?? "External Link Click"}
		data-umami-event-url={linkData.href}
		data-umami-event-label={linkData?.ariaLabel ??
			linkData?.title ??
			linkData?.href}
	>
		{#if textData?.location === "top" || (textData?.location === "left" && textData?.text)}
			{textData?.text}
		{/if}
		{#if textData?.showIcon}
			{@render linkIcon(safeIconData, iconSize)}
		{/if}
		{#if textData?.location === "bottom" || (textData?.location === "right" && textData?.text)}
			{textData?.text}
		{/if}
	</a>
{/snippet}

{#snippet linkIcon({ type, icon, iconClass }: LinkIconType, size: number = 20)}
	{#if type === "svg" && icon && typeof icon === "function"}
		<svg
			style="width: {size}px; height: {size}px;"
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
		<Icon {size} strokeWidth={2}
			><title
				>{linkData?.title ?? `Open ${linkData?.ariaLabel} externally`}</title
			></Icon
		>
	{:else}
		{@const Icon = ExternalLink}
		<Icon {size} strokeWidth={2}
			><title
				>{linkData?.title ?? `Open ${linkData?.ariaLabel} externally`}</title
			></Icon
		>
	{/if}
{/snippet}

{@render externalLink({ iconData, linkData, textData })}

<style lang="postcss">
	a {
		display: grid;
		place-items: center;
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
		align-items: center;
		place-content: center;
		gap: 0.5rem;
		transition: all 0.2s ease;

		&:hover {
			transform: translateY(-1px);
			color: var(--shellYellow);
		}

		&:active {
			transform: translateY(0);
		}
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
