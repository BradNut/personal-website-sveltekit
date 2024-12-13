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
	<h3>
		{#each externalLinks as link}
			<ExternalLink
				linkData={{ href: link.href, ariaLabel: link.ariaLabel, title: link.ariaLabel, target: '_blank', clazz: "tech-list-item" }}
				textData={{ text: link.text, showIcon: link.showIcon, location: 'bottom' }}
			/>
		{/each}
	</h3>
	<div class="tags">
		{#each tags as tag}
			<Tag name={tag} />
		{/each}
	</div>
</div>

<style lang="postcss">
	.card {
		max-width: 30rem;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		justify-content: left;
		align-items: center;
	}
</style>