<script lang="ts">
import { Mail } from 'lucide-svelte';
import ExternalLink from '$lib/components/ExternalLink.svelte';
import { blueSkyIcon, gitHubIcon, linkedInIcon, xIcon } from '../util/logoIcons.svelte';

interface Props {
  showBlueSky?: boolean;
  showEmail?: boolean;
  showGithub?: boolean;
  showLinkedIn?: boolean;
  showX?: boolean;
  userNames: Record<string, string>;
  showText?: boolean;
  justify?: boolean;
}

let {
  showBlueSky = false,
  showEmail = false,
  showGithub = false,
  showLinkedIn = false,
  showX = false,
  userNames,
  showText = false,
  justify = false,
}: Props = $props();
</script>

{#if showText}
	<h3>Contact Information</h3>
{/if}
<div class:justifyCenter={justify}>
	{#if showX && userNames?.x}
		<ExternalLink
			linkData={{
				href: `https://www.x.com/${userNames.x}`,
				ariaLabel: "Contact through X",
				title: "Contact through X",
				target: "_blank",
				clazz: "hub-icon x-contact",
			}}
			iconData={{ type: "svg", icon: xIcon, iconClass: "center" }}
			textData={{ showIcon: true }}
		/>
	{/if}
	{#if showBlueSky && userNames?.blueSky}
		<ExternalLink
			linkData={{
				href: `https://bsky.app/profile/${userNames.blueSky}`,
				ariaLabel: "Contact through Bluesky",
				title: "Contact through Bluesky",
				target: "_blank",
				clazz: "hub-icon bluesky-contact",
			}}
			iconData={{ type: "svg", icon: blueSkyIcon, iconClass: "center" }}
			textData={{ showIcon: true }}
		/>
	{/if}
	{#if showLinkedIn && userNames?.linkedIn}
		<ExternalLink
			linkData={{
				href: `https://www.linkedin.com/in/${userNames.linkedIn}`,
				ariaLabel: "Contact through LinkedIn",
				title: "Contact through LinkedIn",
				target: "_blank",
				clazz: "hub-icon linkedIn-contact",
			}}
			iconData={{ type: "svg", icon: linkedInIcon, iconClass: "center" }}
			textData={{ showIcon: true }}
		/>
	{/if}
	{#if showGithub && userNames?.github}
		<ExternalLink
			linkData={{
				href: `https://www.github.com/${userNames.github}`,
				ariaLabel: "Contact through Github",
				title: "Contact through Github",
				target: "_blank",
				clazz: "hub-icon github-contact",
			}}
			iconData={{ type: "svg", icon: gitHubIcon, iconClass: "center" }}
			textData={{ showIcon: true }}
		/>
	{/if}
	{#if showEmail && userNames?.email}
		<ExternalLink
			linkData={{
				href: `mailto:${userNames.email}`,
				ariaLabel: "Contact by email",
				title: "Contact by email",
				target: "_blank",
				clazz: "hub-icon email-contact",
			}}
			iconData={{ type: "icon", icon: Mail, iconClass: "center" }}
			textData={{ showIcon: true }}
		/>
	{/if}
</div>

<style lang="postcss">
	div {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		align-items: center;

		&.justifyCenter {
			justify-content: center;
		}
	}

	:global(.hub-icon) {
		transition: transform 0.2s cubic-bezier(0.65, 0, 0.35, 1);
		&:hover {
			transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
			transform: translateY(-4px);
		}
	}

	:global(.x-contact) {
		color: var(--textColor);
		&:hover {
			color: var(--xColor);
		}
	}

	:global(.linkedIn-contact) {
		color: var(--textColor);
		&:hover {
			color: var(--linkedInColor);
		}
	}

	:global(.github-contact) {
		color: var(--textColor);
		&:hover {
			color: var(--githubColor);
		}
	}

	:global(.bluesky-contact) {
		color: var(--textColor);
		&:hover {
			color: var(--blueskyColor);
		}
	}

	:global(.email-contact) {
		color: var(--textColor);
		&:hover {
			color: var(--linkHover);
		}
	}
</style>
