<script lang="ts">
	import ExternalLink from "$lib/components/ExternalLink.svelte";
	import Portfolio from "./Portfolio.svelte";
	// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
	// import OldWebsite from "$lib/content/portfolio/personal/old-website.md";
	// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
	// import PersonalWebsiteSvelteKit from "$lib/content/portfolio/personal/personal-website-sveltekit.md";
	// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
	// import WeddingWebsite from "$lib/content/portfolio/personal/wedding-website.md";
	// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
	// import MarkShellnutArchitect from "$lib/content/portfolio/professional/mark-shellnut-architect.md";
	import type { ExternalLinkType } from "$lib/types/externalLinkType";
	import { Tabs } from "bits-ui";
	import personalSite from "../../lib/assets/images/portfolio/Bradley_Shellnut_New_Site.png?enhanced";
	import shellnutArchitectWebsite from "../../lib/assets/images/portfolio/Mark_Shellnut_Architect.png?enhanced";
	import oldSite from "../../lib/assets/images/portfolio/Old_Website_Bradley_Shellnut.png?enhanced";
	import weddingWebsite from "../../lib/assets/images/portfolio/Wedding_Website.png?enhanced";
	import { gitHubIcon } from "$root/lib/util/logoIcons.svelte";
</script>

{#snippet links(externalLinks: ExternalLinkType[])}
	<span>
		{#each externalLinks as link}
			{#if link.icon && link.showIcon}
				<ExternalLink
					linkData={{
						href: link.href,
						ariaLabel: link.ariaLabel,
						title: link.ariaLabel,
						target: "_blank",
					}}
					textData={{
						text: link.text,
						showIcon: link.showIcon,
						location: "left",
					}}
					iconData={{ type: "svg", icon: link.icon }}
				/>
			{:else}
				<ExternalLink
					linkData={{
						href: link.href,
						ariaLabel: link.ariaLabel,
						title: link.ariaLabel,
						target: "_blank",
					}}
					textData={{
						text: link.text,
						showIcon: link.showIcon,
						location: "left",
					}}
				/>
			{/if}
		{/each}
	</span>
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
			externalLinks={[
				{
					ariaLabel: "View GitHub repository for my personal website",
					href: "https://github.com/BradNut/personal-website-sveltekit",
					icon: gitHubIcon,
					showIcon: true,
					text: "GitHub repository",
				},
			]}
		>
			<h2>My personal website re-written using SvelteKit.</h2>
			Tech Stack:
			<ul>
				<li>
					<ExternalLink
						linkData={{
							href: "https://kit.svelte.dev/",
							ariaLabel: "SvelteKit",
						}}
						textData={{ text: "SvelteKit", showIcon: true, location: "left" }}
					/>
				</li>
				<li>
					<ExternalLink
						linkData={{ href: "https://bits-ui.com/", ariaLabel: "Bits-UI" }}
						textData={{ text: "Bits-UI", showIcon: true, location: "left" }}
					/> for the headless-ui components.
				</li>
				<li>
					<ExternalLink
						linkData={{
							href: "https://www.typescriptlang.org/",
							ariaLabel: "TypeScript",
						}}
						textData={{ text: "TypeScript", showIcon: true, location: "left" }}
					/>
				</li>
				<li>Deployed on a Coolify Self Hosted Box</li>
				<li>
					Icons in the <a href="/about">/about</a> page and the Bee, Shell, and
					Nut icons are all made by <ExternalLink
						linkData={{
							href: "https://www.flaticon.com/authors/freepik",
							ariaLabel: "Freepik",
						}}
						textData={{ text: "Freepik", showIcon: true, location: "right" }}
					/> from <ExternalLink
						textData={{ text: "Flaticon", showIcon: true, location: "right" }}
						linkData={{
							href: "https://www.flaticon.com/",
							ariaLabel: "Flaticon",
						}}
					/>
				</li>
			</ul>

			Previous version of my website was written using React and Gatsby which
			you can view <ExternalLink
				linkData={{
					href: "https://bradleyshellnut.com",
					ariaLabel: "React and Gatsby Personal Site version",
				}}
				textData={{ text: "here", showIcon: true, location: "right" }}
			/>. Each iteration brings better code and my previous React version was
			improved after the suggestions on <ExternalLink
				linkData={{
					href: "https://syntax.fm/show/444/syntax-highlight#t=33:19",
					ariaLabel: "Syntax.fm Podcast Number 444",
				}}
				textData={{ text: "Show 444", showIcon: true, location: "right" }}
			/> of the <ExternalLink
				linkData={{ href: "https://syntax.fm/", ariaLabel: "Syntax.fm" }}
				textData={{ text: "Syntax Pocast", showIcon: true, location: "right" }}
			/>. You can view the previous archived version of the site before those
			changes <ExternalLink
				textData={{ text: "here", showIcon: true, location: "right" }}
				linkData={{
					href: "https://web.archive.org/web/20210224002046/https://bradleyshellnut.com/",
					ariaLabel: "Archive before Syntax Podcast",
				}}
			/>.
		</Portfolio>
		<!-- <Portfolio
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
					icon: gitHubIcon,
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
					icon: gitHubIcon,
					showIcon: true,
					text: "Link to an archive snapshot",
				},
			]}
		/> -->
	</Tabs.Content>
	<Tabs.Content value="professional">
		<!-- <Portfolio
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
		/> -->
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
