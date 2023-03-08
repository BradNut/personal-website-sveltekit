<script lang="ts">
	import type { PageData } from "./$types";
  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
  } from "@rgossiaux/svelte-headlessui";
	import { Picture } from "svelte-lazy-loader";
	import GitHub from '@iconify-icons/simple-icons/github';
	import Portfolio from '$lib/components/Portfolio.svelte';
	import personalSite from "$lib/assets/images/Bradley_Shellnut_New_Site.png";
	import personalSiteFormats from "$lib/assets/images/Bradley_Shellnut_New_Site.png?format=webp;avif;png&metadata";
	import personalSiteBlurred from "$lib/assets/images/Bradley_Shellnut_New_Site.png?w=100&png&blur=10";
  import weddingWebsite from "$lib/assets/images/Wedding_Website.png";
	import weddingWebsiteFormats from "$lib/assets/images/Wedding_Website.png?format=webp;avif;png&metadata";
	import weddingWebsiteBlurred from "$lib/assets/images/Wedding_Website.png?w=100&png&blur=10";
	import oldSite from '$lib/assets/images/Old_Website_Bradley_Shellnut.png';
	import oldSiteFormats from '$lib/assets/images/Old_Website_Bradley_Shellnut.png?format=webp;avif;png&metadata';
	import oldSiteBlurred from '$lib/assets/images/Old_Website_Bradley_Shellnut.png?w=100&png&blur=10';
	import shellnutArchitectWebsite from "$lib/assets/images/Mark_Shellnut_Architect.png";
  import shellnutArchitectWebsiteFormats from "$lib/assets/images/Mark_Shellnut_Architect.png?format=webp;avif;png&metadata";
	import shellnutArchitectWebsiteBlurred from "$lib/assets/images/Mark_Shellnut_Architect.png?w=100px&blur=10";
	import PersonalWebsiteGatsby from "$lib/content/portfolio/personal/personal-website-gatsby.md";
	import WeddingWebsite from '$lib/content/portfolio/personal/wedding-website.md';
	import MarkShellnutArchitect from '$lib/content/portfolio/professional/mark-shellnut-architect.md';
	import OldWebsite from '$lib/content/portfolio/personal/old-website.md';
	import ExternalLink from '$lib/components/ExternalLink.svelte';

	export let data: PageData;

</script>

<svelte:head>
	<title>Portfolio | Bradley Shellnut</title>
</svelte:head>

<h1>Portfolio!</h1>
<TabGroup>
	<TabList aria-label="tabs portfolios" class="tab-list">
		<Tab class={({selected}) => selected ? "tab-selected portfolio-tab" : "tab-unselected portfolio-tab"}>
			<h2>Personal Sites</h2>
		</Tab>
		<Tab value="professional-sites" class={({selected}) => selected ? "tab-selected portfolio-tab" : "tab-unselected portfolio-tab"}>
			<h2>Professional Sites</h2>
		</Tab>
	</TabList>
	<TabPanels>
		<TabPanel>
			<Portfolio name="Personal Website"
				placeholder={personalSiteBlurred}
				src={personalSite}
				alt="Picture of Bradley Shellnut's Gatsby Personal Website"
				formats={personalSiteFormats}>
				<PersonalWebsiteGatsby slot="portfolio-details" />
			</Portfolio>
			<Portfolio name="Wedding Website"
				placeholder={weddingWebsiteBlurred}
				src={weddingWebsite}
				alt="Picture of Bradley Shellnut's Gatsby Personal Website"
				formats={weddingWebsiteFormats}>
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
				placeholder={oldSiteBlurred}
				src={oldSite}
				alt="Home Page of the old bradleyshellnut.com website"
				formats={oldSiteFormats}>
				<span slot="portfolio-links">
					<p>
						<ExternalLink ariaLabel="Archive of bradleyshellnut.com" href="https://web.archive.org/web/20201205233507/https://bradleyshellnut.com/about" showIcon>Link to an archive snapshot</ExternalLink>
					</p>
				</span>
				<OldWebsite slot="portfolio-details" />
			</Portfolio>
		</TabPanel>
		<TabPanel>
			<!-- <div class="portfolioStyles"> -->
				<Portfolio name="Mark Shellnut Architect"
					placeholder={shellnutArchitectWebsiteBlurred}
					src={shellnutArchitectWebsite}
					alt="Picture of Mark Shellnut Architect's Website"
					formats={shellnutArchitectWebsiteFormats}>
					<MarkShellnutArchitect slot="portfolio-details" />
				</Portfolio>
			<!-- </div> -->
		</TabPanel>
	</TabPanels>
</TabGroup>

<style lang="postcss">
	:global(.tab-list) {
		display: grid;
		gap: 1rem;
		grid-template-columns: auto auto;
		place-content: start;
		place-items: center;
		margin-bottom: 1.5rem;
	}

	:global(img) {
		border-radius: 3px;
	}

	:global(.portfolioStyles) {
		margin: 0.5rem auto;

		@media (max-width: 800px) {
			grid-gap: 1.2rem;
			margin: 0.2rem 0;
		}
	}

	:global(.tab-unselected) {
		h2 {
			border-bottom: 2px solid var(--white);
		}
	}
	
	:global(.tab-selected) {
		h2 {
			border-bottom: 2px solid var(--shellYellow);
		}
	}
</style>