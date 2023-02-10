<script lang="ts">
	import { page } from "$app/stores";
	console.log(`error page ${JSON.stringify($page)}`)
</script>

{#if $page.status === 404}
	<h1>Sorry page not found! 🤷🏼</h1>
	<p>You just hit a route that doesn't exist.</p>
{/if}

{#if $page.status === 500}
	<h1>Sorry an unexpected error occurred! 😿</h1>
	<p>Please try again later. </p>
{/if}