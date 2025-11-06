<script lang="ts">
	import ExternalLink from "$lib/components/ExternalLink.svelte";
	import Tag from "$lib/components/Tag.svelte";
	import type { Course } from "$lib/types/courses";

	interface Props {
		course: Course;
	}

	let { course }: Props = $props();
	const { externalLinks, tags } = course;
</script>

<div class="card">
	<div class="links">
		{#each externalLinks as link}
			{#if link.tag === 'h4'}
				<h4>
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
				</h4>
			{:else if link.tag === 'h5'}
				<h5>
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
				</h5>
			{:else}
				<h3>
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
				</h3>
			{/if}
		{/each}
	</div>
	<div class="tags">
		{#each tags as tag}
			<Tag name={tag} />
		{/each}
	</div>
</div>

<style lang="postcss">
	.links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.links h3,
	.links h4,
	.links h5 {
		margin: 0;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}
</style>
