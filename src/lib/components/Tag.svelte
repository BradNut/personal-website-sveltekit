<script lang="ts">
	import Badge from './Badge.svelte';

	interface Props {
		name: string;
	}

	let { name }: Props = $props();
</script>

<Badge>{name}</Badge>
