<script lang="ts">
	import { createTabs } from '@melt-ui/svelte';
	import GitHub from '@iconify-icons/simple-icons/github';
	import SEO from '$lib/components/SEO.svelte';
	import Portfolio from '$lib/components/Portfolio.svelte';
	import personalSite from "$lib/assets/images/Bradley_Shellnut_New_Site.png?run";
  import weddingWebsite from "$lib/assets/images/Wedding_Website.png?run";
	import oldSite from '$lib/assets/images/Old_Website_Bradley_Shellnut.png?run';
	import shellnutArchitectWebsite from "$lib/assets/images/Mark_Shellnut_Architect.png?run";
	import PersonalWebsiteSvelteKit from "$lib/content/portfolio/personal/personal-website-sveltekit.md";
	import WeddingWebsite from '$lib/content/portfolio/personal/wedding-website.md';
	import MarkShellnutArchitect from '$lib/content/portfolio/professional/mark-shellnut-architect.md?run';
	import OldWebsite from '$lib/content/portfolio/personal/old-website.md';
	import ExternalLink from '$lib/components/ExternalLink.svelte';

	const { root, list, content, trigger } = createTabs({
    value: 'personal',
  });
</script>

<SEO title="Portfolio" />

<h1>Portfolio!</h1>
<div {...$root} class="root tab-group">
	<div {...$list} aria-label="tabs portfolios" class="list tab-list">
		<button {...$trigger('personal')} use:trigger class="trigger">
			<h2>Personal Sites</h2>
		</button>
		<button {...$trigger('professional')} use:trigger value="professional-sites" class="trigger">
			<h2>Professional Sites</h2>
		</button>
	</div>
	<div {...$content('personal')} class="content">
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
	<div {...$content('professional')} class="content">
		<Portfolio name="Mark Shellnut Architect"
			style="max-height: 640px;"
			src={shellnutArchitectWebsite}
			alt="Picture of Mark Shellnut Architect's Website">
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

		& [data-orientation="vertical"] {
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

	.trigger[data-state='active'] {
		& h2 {
			border-bottom: 2px solid var(--shellYellow);
		}
	}

	.trigger[data-state='inactive'] {
		& h2 {
			border-bottom: 2px solid var(--white);
		}
	}

	:global(img) {
		border-radius: 3px;
	}
</style>