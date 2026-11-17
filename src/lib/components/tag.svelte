<script lang="ts">
	import Badge from './badge.svelte';

	interface Props {
		name: string;
	}

	let { name }: Props = $props();
</script>

<Badge>{name}</Badge>
