<script lang="ts">
	import type { PageData } from "./$types";
	import SEO from "$root/lib/components/SEO.svelte";

	export let data: PageData;

	const currentPage: number = 1;
</script>

<SEO title={`Tech Articles - Page ${currentPage}`} />
