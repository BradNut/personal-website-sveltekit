<script lang="ts">
	import { ExternalLink as ExternalLinkIcon } from '@lucide/svelte';
	import { Tabs } from 'bits-ui';
	import type { Picture } from 'vite-imagetools';

	import ExternalLink from '$lib/components/ExternalLink.svelte';
	import type { ProjectLink } from '$lib/types/externalLinkType';
	import { gitHubIcon } from '$lib/util/logoIcons.svelte';

	import personalSiteImg from '../../lib/assets/images/portfolio/Bradley_Shellnut_New_Site.png?enhanced';
	import shellnutArchitectWebsiteImg from '../../lib/assets/images/portfolio/Mark_Shellnut_Architect.png?enhanced';
	import oldSiteImg from '../../lib/assets/images/portfolio/Old_Website_Bradley_Shellnut.png?enhanced';
	import weddingWebsiteImg from '../../lib/assets/images/portfolio/Wedding_Website.png?enhanced';
	import type { PageData } from './$types';
	import Portfolio from './Portfolio.svelte';

	const { data }: { data: PageData } = $props();

	const imageMap: Record<string, string | Picture> = {
		personalSite: personalSiteImg,
		weddingWebsite: weddingWebsiteImg,
		oldSite: oldSiteImg,
		shellnutArchitectWebsite: shellnutArchitectWebsiteImg,
	};

	function resolveLinks(links: PageData['projects'][number]['externalLinks']): ProjectLink[] {
		return links.map((link) => ({
			ariaLabel: link.ariaLabel,
			href: link.href,
			showIcon: link.showIcon,
			text: link.text,
			linkType: link.linkType,
			icon: link.iconKey === 'github' ? gitHubIcon : link.iconKey === 'external' ? ExternalLinkIcon : undefined,
		}));
	}
</script>

<h1>Portfolio!</h1>
<Tabs.Root value="personal">
	<Tabs.List>
		<Tabs.Trigger value="personal"><span>Personal</span></Tabs.Trigger>
		<Tabs.Trigger value="professional"><span>Professional</span></Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="personal">
		{#each data.projects.filter((p) => p.category === 'personal') as project}
			<Portfolio
				name={project.name}
				style={project.style}
				src={imageMap[project.imageKey]}
				alt={project.alt}
				loading={project.loading ?? 'lazy'}
				externalLinks={resolveLinks(project.externalLinks)}
			>
				<section>
					<h3>Tech stack:</h3>
					<ul>
						{#each project.techStack as item}
							<li>
								{#if item.href}
									<ExternalLink
										linkData={{ href: item.href, ariaLabel: item.label }}
										textData={{ text: item.label, showIcon: true, location: 'left' }}
									/>
								{:else}
									{item.label}
								{/if}
							</li>
						{/each}
					</ul>
				</section>
				<section class="portfolio-details">
					{#each project.description as paragraph}
						<p>{paragraph}</p>
					{/each}
				</section>
			</Portfolio>
		{/each}
	</Tabs.Content>
	<Tabs.Content value="professional">
		{#each data.projects.filter((p) => p.category === 'professional') as project}
			<Portfolio
				name={project.name}
				style={project.style}
				src={imageMap[project.imageKey]}
				alt={project.alt}
				loading={project.loading ?? 'lazy'}
				externalLinks={resolveLinks(project.externalLinks)}
			>
				<section>
					<h3>Tech stack:</h3>
					<ul>
						{#each project.techStack as item}
							<li>
								{#if item.href}
									<ExternalLink
										linkData={{ href: item.href, ariaLabel: item.label }}
										textData={{ text: item.label, showIcon: true, location: 'left' }}
									/>
								{:else}
									{item.label}
								{/if}
							</li>
						{/each}
					</ul>
				</section>
				<section class="portfolio-details">
					{#each project.description as paragraph}
						<p>{paragraph}</p>
					{/each}
				</section>
			</Portfolio>
		{/each}
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

	:global(.portfolio-details section) {
		margin-bottom: 2rem;
	}

	:global(.portfolio-details h3) {
		margin-bottom: 0.75rem;
		color: var(--shellYellow);
	}

	:global(.portfolio-details ul) {
		display: flex;
		flex-direction: column;
	}

	:global(.portfolio-details ul li) {
		line-height: 1.6;
	}
</style>
