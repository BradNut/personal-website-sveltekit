<script lang="ts">
	import '../app.postcss';
	import Header from '$lib/components/header/index.svelte';
	import Footer from '$lib/components/footer/index.svelte';
</script>

<Header />
<main>
	<slot />
</main>
<Footer />
