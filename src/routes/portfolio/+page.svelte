<script lang="ts">
	import { createTabs, melt } from '@melt-ui/svelte';
	import GitHub from '@iconify-icons/simple-icons/github';
	import SEO from '$lib/components/SEO.svelte';
	import Portfolio from '$lib/components/Portfolio.svelte';
	import personalSite from "$lib/assets/images/Bradley_Shellnut_New_Site.png?as=run";
  import weddingWebsite from "$lib/assets/images/Wedding_Website.png?as=run";
	import oldSite from '$lib/assets/images/Old_Website_Bradley_Shellnut.png?as=run';
	import shellnutArchitectWebsite from "$lib/assets/images/Mark_Shellnut_Architect.png?as=run";
	import PersonalWebsiteSvelteKit from "$lib/content/portfolio/personal/personal-website-sveltekit.md";
	import WeddingWebsite from '$lib/content/portfolio/personal/wedding-website.md';
	import MarkShellnutArchitect from '$lib/content/portfolio/professional/mark-shellnut-architect.md?as=run';
	import OldWebsite from '$lib/content/portfolio/personal/old-website.md';
	import ExternalLink from '$lib/components/ExternalLink.svelte';

	const {
		elements: { root, list, content, trigger }
	} = createTabs({
		defaultValue: 'personal'
	});

	const triggers = [
		{ id: 'personal', title: 'Personal Sites' },
		{ id: 'professional', title: 'Professional Sites'}
	];
</script>

<SEO title="Portfolio" />

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
			style="max-height: 640px;"
			src={personalSite}
			loading="eager"
			alt="Picture of Bradley Shellnut's Personal Website">
			<span slot="portfolio-links">
				<p>
					<ExternalLink ariaLabel="View GitHub repository for my personal website" href="https://github.com/BradNut/personal-website-sveltekit" icon={GitHub} showIcon>GitHub repository</ExternalLink>
				</p>
			</span>
			<PersonalWebsiteSvelteKit slot="portfolio-details" />
		</Portfolio>
		<Portfolio name="Wedding Website"
			style="max-height: 640px;"
			src={weddingWebsite}
			alt="Picture of NextJS Wedding Website">
			<span slot="portfolio-links">
				<p>
					<ExternalLink ariaLabel="View Wedding Website" href="https://weddingsite-six.vercel.app/" showIcon>View Site</ExternalLink>
				</p>
				<p>
					<ExternalLink ariaLabel="View GitHub repository for the wedding site" href="https://github.com/BradNut/weddingsite" icon={GitHub} showIcon>GitHub repository</ExternalLink>
				</p>
			</span>
			<WeddingWebsite slot="portfolio-details" />
		</Portfolio>
		<Portfolio name="Old Personal Website"
			style="max-height: 320px;"
			src={oldSite}
			alt="Home Page of the old bradleyshellnut.com website">
			<span slot="portfolio-links">
				<p>
					<ExternalLink ariaLabel="Archive of bradleyshellnut.com" href="https://web.archive.org/web/20201205233507/https://bradleyshellnut.com/about" showIcon>Link to an archive snapshot</ExternalLink>
				</p>
			</span>
			<OldWebsite slot="portfolio-details" />
		</Portfolio>
	</div>
	<div use:melt={$content('professional')} class="content">
		<Portfolio name="Mark Shellnut Architect"
			style="max-height: 640px;"
			src={shellnutArchitectWebsite}
			alt="Picture of Mark Shellnut Architect's Website">
			<span slot="portfolio-links">
				<p>
					<ExternalLink ariaLabel="View markshellnutarchitect.com" href="https://markshellnutarchitect.com" showIcon>Link to Mark Shellnut's Website</ExternalLink>
				</p>
			</span>
			<MarkShellnutArchitect slot="portfolio-details" />
		</Portfolio>
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