<script lang="ts">
import ExternalLink from '$lib/components/ExternalLink.svelte';
import Portfolio from '$lib/components/Portfolio.svelte';
// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
import OldWebsite from '$lib/content/portfolio/personal/old-website.md';
// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
import PersonalWebsiteSvelteKit from '$lib/content/portfolio/personal/personal-website-sveltekit.md';
// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
import WeddingWebsite from '$lib/content/portfolio/personal/wedding-website.md';
// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
import MarkShellnutArchitect from '$lib/content/portfolio/professional/mark-shellnut-architect.md';
import type { ExternalLinkType } from '$lib/types/externalLinkType';
import GitHub from '@iconify-icons/simple-icons/github';
import { createTabs, melt } from '@melt-ui/svelte';
import personalSite from '../../lib/assets/images/portfolio/Bradley_Shellnut_New_Site.png?enhanced';
import shellnutArchitectWebsite from '../../lib/assets/images/portfolio/Mark_Shellnut_Architect.png?enhanced';
import oldSite from '../../lib/assets/images/portfolio/Old_Website_Bradley_Shellnut.png?enhanced';
import weddingWebsite from '../../lib/assets/images/portfolio/Wedding_Website.png?enhanced';

const {
  elements: { root, list, content, trigger },
} = createTabs({
  defaultValue: 'personal',
});

const triggers = [
  { id: 'personal', title: 'Personal Sites' },
  { id: 'professional', title: 'Professional Sites' },
];
</script>

{#snippet links(externalLinks: ExternalLinkType[])}
	<span>
		{#each externalLinks as link}
			<ExternalLink
				ariaLabel={link.ariaLabel}
				href={link.href}
				icon={link.icon}
				showIcon={link.showIcon}
			>
				{link.text}
			</ExternalLink>
		{/each}
	</span>
{/snippet}

{#snippet details(portfolioDetails: string)}
	{portfolioDetails}
{/snippet}

<h1>Portfolio!</h1>
<div use:melt={$root} class="root tab-group">
	<div use:melt={$list} aria-label="tabs portfolios" class="list tab-list">
		{#each triggers as triggerItem}
			<button use:melt={$trigger(triggerItem.id)} class="trigger" type="button">
				<h2>{triggerItem.title}</h2>
			</button>
		{/each}
	</div>
	<div use:melt={$content('personal')} class="content">
		<Portfolio name="Personal Website"
			style="max-height: 550px;"
			src={personalSite}
			loading="eager"
			alt="Picture of Bradley Shellnut's Personal Website"
			{links}
			{details}
			portfolioDetails={PersonalWebsiteSvelteKit}
			externalLinks={[{ ariaLabel: 'View GitHub repository for my personal website', href: 'https://github.com/BradNut/personal-website-sveltekit', icon: GitHub, showIcon: true, text: 'GitHub repository'}]}>
		</Portfolio>
		<Portfolio name="Wedding Website"
			style="max-height: 550px;"
			src={weddingWebsite}
			alt="Picture of NextJS Wedding Website"
			{links}
			{details}
			portfolioDetails={WeddingWebsite}
			externalLinks={[{ ariaLabel: 'View GitHub repository for the wedding site', href: 'https://github.com/BradNut/weddingsite', icon: GitHub, showIcon: true, text: 'GitHub repository'}]}/>
			<Portfolio name="Old Personal Website"
			style="max-height: 320px;"
			src={oldSite}
			alt="Home Page of the old bradleyshellnut.com website"
			{links}
			{details}
			portfolioDetails={OldWebsite}
			externalLinks={[{ ariaLabel: 'Archive of bradleyshellnut.com', href: 'https://web.archive.org/web/20201205233507/https://bradleyshellnut.com/about', icon: GitHub, showIcon: true, text: 'Link to an archive snapshot'}]}/>
	</div>
	<div use:melt={$content('professional')} class="content">
		<Portfolio name="Mark Shellnut Architect"
			style="max-height: 550px;"
			src={shellnutArchitectWebsite}
			alt="Picture of Mark Shellnut Architect's Website"
			{links}
			{details}
			portfolioDetails={MarkShellnutArchitect}
			externalLinks={[{ ariaLabel: 'View Mark Shellnut Architect', href: 'https://markshellnutarchitect.com', showIcon: false, text: 'Link to Mark Shellnut Architect'}]} />
	</div>
</div>

<style lang="postcss">
	.root {
		display: flex;
		flex-direction: column;
		/* overflow: hidden; */
		/* border-radius: var(--border-radius); */

		&[data-orientation="vertical"] {
			flex-direction: row;
		}

		@media(min-width: 1000px) {
			max-width: 50vw;
		}
	}

	.list {
		display: grid;
		gap: 1rem;
		grid-template-columns: auto auto;
		place-content: start;
		place-items: center;
		margin-bottom: 1.5rem;
		cursor: default;
		user-select: none;
	}

	.trigger {
		&[data-state='active'] {
			h2 {
				border-bottom: 2px solid var(--shellYellow);
			}
		}

	 	&[data-state='inactive'] {
			h2 {
				border-bottom: 2px solid var(--white);
			}
		}
	}

	:global(img) {
		border-radius: 3px;
	}
</style>