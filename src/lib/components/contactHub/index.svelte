<script lang="ts">
	import email from '@iconify-icons/material-symbols/mail';
	import github from '@iconify-icons/radix-icons/github-logo';
	import linkedin from '@iconify-icons/radix-icons/linkedin-logo';
	import twitter from '@iconify-icons/radix-icons/twitter-logo';

	const { showGithub = false, showTwitter = false, showLinkedIn = false, showEmail = false, userNames, showText = false, justify = false } = $props<{
		showGithub?: boolean;
		showTwitter?: boolean;
		showLinkedIn?: boolean;
		showEmail?: boolean;
		userNames: Record<string, string>;
		showText?: boolean;
		justify?: boolean
	}>();
</script>

{#if showText}
	<h3>Contact Information</h3>
{/if}
<div class:justifyCenter={justify}>
	{#if showTwitter && userNames?.twitter}
		<span>
			<a
				href={`https://www.twitter.com/${userNames.twitter}`}
				target="_blank"
				title="Contact through Twitter"
				aria-label="Contact through Twitter"
				rel="noreferrer"
			>
				<iconify-icon icon={twitter} class="twitter-contact" width="24" height="24" />
			</a>
		</span>
	{/if}
	{#if showLinkedIn && userNames?.linkedIn}
		<span>
			<a
				href={`https://www.linkedin.com/in/${userNames.linkedIn}`}
				target="_blank"
				title="Contact through LinkedIn"
				aria-label="Contact through LinkedIn"
				rel="noreferrer"
			>
				<iconify-icon icon={linkedin} class="linkedin-contact" width="24" height="24" />
			</a>
		</span>
  {/if}
	{#if showGithub && userNames?.github}
		<span>
			<a
				href={`https://www.github.com/${userNames.github}`}
				target="_blank"
				title="View Github"
				aria-label="View Github"
				rel="noreferrer"
			>
			<iconify-icon icon={github} class="github-contact" width="24" height="24" />
			</a>
		</span>
  {/if}
	{#if showEmail && userNames?.email}
		<span>
			<a
				href={`mailto:${userNames.email}`}
				target="_blank"
				title="Contact by email"
				aria-label="Contact by email"
				rel="noreferrer"
			>
				<iconify-icon icon={email} class="email-contact" width="24" height="24" />
			</a>
		</span>
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

		--twitterColor: #1da1f2;
		--linkedInColor: #0a66c2;
		--githubColor: #72757e;
		--emailColor: var(--linkHover);
	}

  iconify-icon {
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
  .twitter-contact {
    color: var(--textColor);
    &:hover {
      color: var(--twitterColor);
    }
  }
  .linkedin-contact {
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
  .email-contact {
    color: var(--textColor);
    &:hover {
      color: var(--linkHover);
    }
  }
</style>