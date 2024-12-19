<script lang="ts">
	interface Props {
		name: string;
	}

	let { name }: Props = $props();
</script>

<span>{name}</span>

<style lang="postcss">
	span {
		background-color: var(--linkHover);
		color: var(--buttonTextColor);
		padding: 0.25rem 0.5rem;
		margin: 0.5rem 0.25rem;
		border-radius: 2px;
		font-weight: 800;
		font-size: 1.2rem;
	}
</style>