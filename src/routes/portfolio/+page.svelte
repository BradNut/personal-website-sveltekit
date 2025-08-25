<script lang="ts">
	import { Tabs } from 'bits-ui';
	import ExternalLink from '$lib/components/ExternalLink.svelte';
	import type { ExternalLinkType } from '$lib/types/externalLinkType';
	import { gitHubIcon } from '$lib/util/logoIcons.svelte';
	import personalSite from '../../lib/assets/images/portfolio/Bradley_Shellnut_New_Site.png?enhanced';
	import shellnutArchitectWebsite from '../../lib/assets/images/portfolio/Mark_Shellnut_Architect.png?enhanced';
	import oldSite from '../../lib/assets/images/portfolio/Old_Website_Bradley_Shellnut.png?enhanced';
	import weddingWebsite from '../../lib/assets/images/portfolio/Wedding_Website.png?enhanced';
	import Portfolio from './Portfolio.svelte';
</script>

{#snippet links(externalLinks: ExternalLinkType[])}
	<span>
		{#each externalLinks as link}
			{#if link.icon && link.showIcon}
				{#if typeof link.icon === 'function' && 'length' in link.icon}
					<!-- Snippet icon: pass snippet directly for LinkIconType 'svg' -->
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
						iconData={{ type: 'svg', icon: link.icon as any }}
					/>
				{:else}
					<!-- Component icon (e.g., lucide-svelte) -->
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
						iconData={{ type: 'icon', icon: link.icon as any }}
					/>
				{/if}
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
						textData={{ text: "Freepik", showIcon: true, location: "left" }}
					/> from <ExternalLink
						textData={{ text: "Flaticon", showIcon: true, location: "left" }}
						linkData={{
							href: "https://www.flaticon.com/",
							ariaLabel: "Flaticon",
						}}
					/>
				</li>
			</ul>
			<p>
				The previous version of my website was written using React and Gatsby
				which you can view <ExternalLink
					linkData={{
						href: "https://wonderful-austin-9f17d2.netlify.app/",
						ariaLabel: "React and Gatsby Personal Site version",
					}}
					textData={{ text: "here.", showIcon: true, location: "left" }}
				/>
			</p>
			<p>
				Each iteration brings better code and my previous React version was
				improved after the suggestions on <ExternalLink
					linkData={{
						href: "https://syntax.fm/show/444/syntax-highlight#t=33:19",
						ariaLabel: "Syntax.fm Podcast Number 444",
					}}
					textData={{ text: "Show 444", showIcon: true, location: "left" }}
				/> of the <ExternalLink
					linkData={{ href: "https://syntax.fm/", ariaLabel: "Syntax.fm" }}
					textData={{
						text: "Syntax Pocast.",
						showIcon: true,
						location: "left",
					}}
				/>
			</p>
			<p>
				You can view the previous archived version of the site before those
				changes <ExternalLink
					textData={{ text: "here.", showIcon: true, location: "left" }}
					linkData={{
						href: "https://web.archive.org/web/20210224002046/https://bradleyshellnut.com/",
						ariaLabel: "Archive before Syntax Podcast",
					}}
				/>
			</p>
		</Portfolio>
		<Portfolio
			name="Wedding Website"
			style="max-height: 550px;"
			src={weddingWebsite}
			alt="Picture of NextJS Wedding Website"
			{links}
			externalLinks={[
				{
					ariaLabel: "View GitHub repository for the wedding site",
					href: "https://github.com/BradNut/weddingsite",
					icon: gitHubIcon,
					showIcon: true,
					text: "GitHub repository",
				},
			]}
		>
			<p>
				The app was initially created for my wedding but what is linked here is
				a public demo of the application.
			</p>
			<p>
				An application that allows viewing of wedding details and provides the
				ability to RSVP to the wedding.
			</p>
			<p>Tech stack:</p>
			<ul>
				<li>Next.js 13</li>
				<li>React 18</li>
				<li>
					<ExternalLink
						linkData={{ href: "https://radix-ui.com/", ariaLabel: "Radix UI" }}
						textData={{ text: "Radix UI", showIcon: true, location: "left" }}
					/>
				</li>
				<li>MongoDB</li>
				<li>Styled Components</li>
				<li>Next Iron Session</li>
			</ul>
		</Portfolio>
		<Portfolio
			name="Old Personal Website"
			style="max-height: 320px;"
			src={oldSite}
			alt="Home Page of the old bradleyshellnut.com website"
			{links}
			externalLinks={[
				{
					ariaLabel: "Archive of bradleyshellnut.com",
					href: "https://web.archive.org/web/20201205233507/https://bradleyshellnut.com/about",
					icon: gitHubIcon,
					showIcon: true,
					text: "Link to an archive snapshot",
				},
			]}
		>
			<p>My first personal website</p>
			<p>This was my first real personal website hosted on DigitalOcean.</p>
			<p>Tech stack:</p>
			<ul>
				<li>React</li>
				<li>Redux</li>
				<li>ReactStrap for CSS grid management</li>
				<li>React Router for routing links in the page</li>
			</ul>
		</Portfolio>
	</Tabs.Content>
	<Tabs.Content value="professional">
		<Portfolio
			name="Mark Shellnut Architect"
			style="max-height: 550px;"
			src={shellnutArchitectWebsite}
			alt="Picture of Mark Shellnut Architect's Website"
			{links}
			externalLinks={[
				{
					ariaLabel: "View Mark Shellnut Architect",
					href: "https://markshellnutarchitect.com",
					showIcon: false,
					text: "Link to Mark Shellnut Architect",
				},
			]}
		>
			<p>Company website for Mark Shellnut Architect.</p>
			<p>Tech stack:</p>
			<ul>
				<li>React 18</li>
				<li>Gatsby 5</li>
				<li>
					<ExternalLink
						linkData={{ href: "https://radix-ui.com/", ariaLabel: "Radix UI" }}
						textData={{ text: "Radix UI", showIcon: true, location: "left" }}
					/>
				</li>
				<li>Styled Components</li>
				<li>GraphQL</li>
				<li>Lambda Functions</li>
			</ul>
		</Portfolio>
	</Tabs.Content>
</Tabs.Root>

<style lang="postcss">
  :global([data-tabs-root]) {
    display: flex;
    flex-direction: column;

    @media (min-width: 1000px) {
      max-width: 50vw;
    }
  }

  :global([data-tabs-root][data-orientation="vertical"]) {
    flex-direction: row;
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
