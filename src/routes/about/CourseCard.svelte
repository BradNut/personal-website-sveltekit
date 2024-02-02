<script lang="ts">
	import ExternalLink from "$lib/components/ExternalLink.svelte";
	import Tag from "$lib/components/Tag.svelte";
	import type { Course } from "$lib/types/courses";

	const { course } = $props<{ course: Course }>();
	const { externalLinks, tags } = course;
</script>

<div class="card">
	<h3>
		{#each externalLinks as link}
			<ExternalLink
				ariaLabel={link.ariaLabel}
				href={link.href}
				showIcon={link.showIcon}
			>
				{link.text}
			</ExternalLink>
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