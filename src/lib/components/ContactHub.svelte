<script lang="ts">
	import { Mail } from 'lucide-svelte';
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
		<a
			href={`https://www.x.com/${userNames.x}`}
			target="_blank"
			title="Contact through X"
			aria-label="Contact through X"
			rel="noreferrer"
			class="hub-icon"
		>
			{@render xIcon('x-contact')}
		</a>
	{/if}
	{#if showBlueSky && userNames?.blueSky}
		<a
			href={`https://bsky.app/profile/${userNames.blueSky}`}
			target="_blank"
			title="Contact through Bluesky"
			aria-label="Contact through Bluesky"
			rel="noreferrer"
			class="hub-icon"
		>
			{@render blueSkyIcon('bluesky-contact')}
		</a>
	{/if}
	{#if showLinkedIn && userNames?.linkedIn}
		<a
			href={`https://www.linkedin.com/in/${userNames.linkedIn}`}
			target="_blank"
			title="Contact through LinkedIn"
			aria-label="Contact through LinkedIn"
			rel="noreferrer"
			class="hub-icon"
		>
			{@render linkedInIcon('linkedIn-contact')}
		</a>
  {/if}
	{#if showGithub && userNames?.github}
		<a
			href={`https://www.github.com/${userNames.github}`}
			target="_blank"
			title="View Github"
			aria-label="View Github"
			rel="noreferrer"
			class="hub-icon github-contact"
		>
			{@render gitHubIcon('github-contact')}
		</a>
  {/if}
	{#if showEmail && userNames?.email}
		<a
			href={`mailto:${userNames.email}`}
			target="_blank"
			title="Contact by email"
			aria-label="Contact by email"
			rel="noreferrer"
			class="email-contact hub-icon"
		>
			<Mail size="25" />
		</a>
  {/if}
</div>

<style lang="postcss">
	div {
		display: flex;
		flex-wrap: wrap;
		align-items: center;

		&.justifyCenter {
			justify-content: center;
		}

		--xColor: #000000;
		--linkedInColor: #0077B5;
		--githubColor: #000000;
		--blueskyColor: #0085FF;
		--emailColor: var(--linkHover);
	}

  .hub-icon {
    transition: transform 0.2s cubic-bezier(0.65, 0, 0.35, 1);
    &:hover {
      transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
      transform: translateY(-4px);
    }
  }

  a {
    font-size: 4rem;
    margin: 1.5rem;

    @media (max-width: 550px) {
      font-size: 3.55rem;
    }
  }

  .x-contact {
    color: var(--textColor);
    &:hover {
      color: var(--twitterColor);
    }
  }
  .linkedIn-contact {
    color: var(--textColor);
    &:hover {
      color: var(--linkedInColor);
    }
  }
  .github-contact {
    color: var(--textColor);
    &:hover {
      color: var(--githubColor);
    }
	}
	.bluesky-contact {
		color: var(--textColor);
		&:hover {
			color: var(--blueskyColor);
		}
  }
  .email-contact {
    color: var(--textColor);
    &:hover {
      color: var(--linkHover);
    }
  }
</style>