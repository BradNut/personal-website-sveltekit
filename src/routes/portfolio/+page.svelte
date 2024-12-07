<script lang="ts">
	import ExternalLink from "$lib/components/ExternalLink.svelte";
	import Portfolio from "./Portfolio.svelte";
	// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
	import OldWebsite from "$lib/content/portfolio/personal/old-website.md";
	// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
	import PersonalWebsiteSvelteKit from "$lib/content/portfolio/personal/personal-website-sveltekit.md";
	// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
	import WeddingWebsite from "$lib/content/portfolio/personal/wedding-website.md";
	// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
	import MarkShellnutArchitect from "$lib/content/portfolio/professional/mark-shellnut-architect.md";
	import type { ExternalLinkType } from "$lib/types/externalLinkType";
	import GitHub from "@iconify-icons/simple-icons/github";
	import { Tabs } from "bits-ui";
	import personalSite from "../../lib/assets/images/portfolio/Bradley_Shellnut_New_Site.png?enhanced";
	import shellnutArchitectWebsite from "../../lib/assets/images/portfolio/Mark_Shellnut_Architect.png?enhanced";
	import oldSite from "../../lib/assets/images/portfolio/Old_Website_Bradley_Shellnut.png?enhanced";
	import weddingWebsite from "../../lib/assets/images/portfolio/Wedding_Website.png?enhanced";
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

{#snippet details(portfolioDetails)}
	{@const PortfolioDetails = portfolioDetails}
	<PortfolioDetails />
{/snippet}

<h1>Portfolio!</h1>
<Tabs.Root value="personal">
	<Tabs.List>
		<Tabs.Trigger value="personal"><span>Personal</span></Tabs.Trigger>
		<Tabs.Trigger value="professional"><span>Professional</span></Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="personal">
		<Portfolio
			name="Personal Website"
			style="max-height: 550px;"
			src={personalSite}
			loading="eager"
			alt="Picture of Bradley Shellnut's Personal Website"
			{links}
			{details}
			portfolioDetails={PersonalWebsiteSvelteKit}
			externalLinks={[
				{
					ariaLabel: "View GitHub repository for my personal website",
					href: "https://github.com/BradNut/personal-website-sveltekit",
					icon: GitHub,
					showIcon: true,
					text: "GitHub repository",
				},
			]}
		></Portfolio>
		<Portfolio
			name="Wedding Website"
			style="max-height: 550px;"
			src={weddingWebsite}
			alt="Picture of NextJS Wedding Website"
			{links}
			{details}
			portfolioDetails={WeddingWebsite}
			externalLinks={[
				{
					ariaLabel: "View GitHub repository for the wedding site",
					href: "https://github.com/BradNut/weddingsite",
					icon: GitHub,
					showIcon: true,
					text: "GitHub repository",
				},
			]}
		/>
		<Portfolio
			name="Old Personal Website"
			style="max-height: 320px;"
			src={oldSite}
			alt="Home Page of the old bradleyshellnut.com website"
			{links}
			{details}
			portfolioDetails={OldWebsite}
			externalLinks={[
				{
					ariaLabel: "Archive of bradleyshellnut.com",
					href: "https://web.archive.org/web/20201205233507/https://bradleyshellnut.com/about",
					icon: GitHub,
					showIcon: true,
					text: "Link to an archive snapshot",
				},
			]}
		/>
	</Tabs.Content>
	<Tabs.Content value="professional">
		<Portfolio
			name="Mark Shellnut Architect"
			style="max-height: 550px;"
			src={shellnutArchitectWebsite}
			alt="Picture of Mark Shellnut Architect's Website"
			{links}
			{details}
			portfolioDetails={MarkShellnutArchitect}
			externalLinks={[
				{
					ariaLabel: "View Mark Shellnut Architect",
					href: "https://markshellnutarchitect.com",
					showIcon: false,
					text: "Link to Mark Shellnut Architect",
				},
			]}
		/>
	</Tabs.Content>
</Tabs.Root>

<style lang="postcss">
	:global([data-tabs-root]) {
		display: flex;
		flex-direction: column;

		&[data-orientation="vertical"] {
			flex-direction: row;
		}

		@media (min-width: 1000px) {
			max-width: 50vw;
		}
	}

	:global([data-tabs-list]) {
		display: grid;
		gap: 1rem;
		grid-template-columns: auto auto;
		place-content: start;
		place-items: center;
		margin-bottom: 1.5rem;
		cursor: default;
		user-select: none;
	}

	:global([data-tabs-trigger]) {
		font-size: var(--h2);
	}

	:global([data-state="active"]) {
		span {
			border-bottom: 2px solid var(--shellYellow);
		}
	}

	:global([data-state="inactive"]) {
		span {
			border-bottom: 2px solid var(--white);
		}
	}
</style>
