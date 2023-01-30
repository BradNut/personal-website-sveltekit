<script lang="ts">
	import Logo from '$lib/components/logo/index.svelte';
	import Nav from '$lib/components/nav/index.svelte';
</script>

<header>
	<Logo />
	<Nav />
</header>

<style lang="postcss">
	header {
		display: flex;
		justify-content: space-between;
		//height: var(--headerHeight);
		align-items: center;
		/* color: black; */
		background-color: var(--darkGrey);
		background: var(--headerBackground);
		box-shadow: var(--level-2);
		padding: 0 var(--containerPadding);
		font-size: 1.6rem;
	}

	@media (max-width: 1000px) {
		header {	
			padding-top: 1.25rem;
		}
	}

	@media (max-width: 650px) {
		header {
			align-content: center;
			display: grid;
			justify-items: center;
			grid-template-columns: 1fr;
		}
	}
</style>