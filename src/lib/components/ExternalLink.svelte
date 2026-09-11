<script lang="ts">
	import { ExternalLink } from "@lucide/svelte";
	import type { ProjectLink } from "$lib/types/externalLinkType";
	import type {
		ExternalLinkType,
		LinkIconType,
	} from "$lib/types/externalLinkTypes";

	type Props = (ExternalLinkType | { projectLink: ProjectLink }) & { iconSize?: number };

	const rawProps: Props = $props();

	const isProjectLink = (p: Props): p is { projectLink: ProjectLink; iconSize?: number } =>
		"projectLink" in p;

	const defaultIconData: LinkIconType = { type: "icon", icon: ExternalLink };

	const iconData = $derived(
		isProjectLink(rawProps)
			? (rawProps.projectLink.icon ?? defaultIconData)
			: (rawProps.iconData ?? defaultIconData),
	);
	const linkData = $derived(
		isProjectLink(rawProps)
			? {
					href: rawProps.projectLink.href,
					ariaLabel: rawProps.projectLink.ariaLabel,
					target: "_blank" as const,
					rel: "noopener",
				}
			: rawProps.linkData,
	);
	const textData = $derived(
		isProjectLink(rawProps)
			? {
					text: rawProps.projectLink.text,
					showIcon: rawProps.projectLink.showIcon,
					location: "left" as const,
				}
			: rawProps.textData,
	);
	const iconSize = $derived(rawProps.iconSize ?? 20);
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
		}if (textData?.location === "bottom") {
			return "text-bottom";
		}if (textData?.location === "left") {
			return "text-left";
		}if (textData?.location === "right") {
			return "text-right";
		}
			return "text-left";
	});

	const linkDecoration = $derived(
		linkData?.textDecoration && linkData?.textDecoration === "none"
			? `text-decoration-${linkData?.textDecoration}`
			: "text-decoration-underline",
	);
	const linkClass = $derived(
		`${linkData?.clazz || ""} ${textLocationClass} ${linkDecoration}`.trim(),
	);
	const ariaLabel = $derived(
		`Open ${linkData?.ariaLabel ?? linkData?.title ?? linkData?.href} externally`,
	);
	const titleAttribute = $derived(
		linkData?.title && linkData.title !== ariaLabel ? linkData.title : undefined,
	);
</script>

{#snippet externalLink({
	iconData = { type: "icon", icon: ExternalLink },
	linkData,
	textData,
}: ExternalLinkType)}
	<a
		class={linkClass}
		aria-label={ariaLabel}
		title={titleAttribute}
		href={linkData.href}
		rel={linkData?.rel ?? "noreferrer"}
		target={linkData?.target ?? "_blank"}
		data-umami-event={linkData?.trackingEvent ?? "External Link Click"}
		data-umami-event-url={linkData.href}
		data-umami-event-label={ariaLabel}
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
			aria-hidden="true"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			{@render (icon as any)()}
		</svg>
	{:else if type === "icon" && icon}
		{@const Icon = icon}
		<Icon {size} strokeWidth={2} aria-hidden="true" />
	{:else}
		{@const Icon = ExternalLink}
		<Icon {size} strokeWidth={2} aria-hidden="true" />
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
