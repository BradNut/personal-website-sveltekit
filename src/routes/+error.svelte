<script lang="ts">
	import { StatusCodes } from "$/lib/constants/status-codes";
	import { page } from "$app/state";
</script>

{#if page.status === StatusCodes.NOT_FOUND}
	<h1>Sorry page not found! 🤷🏼</h1>
	<p>You just hit a route that doesn't exist.</p>
{/if}

{#if page.status === StatusCodes.INTERNAL_SERVER_ERROR}
	<h1>Sorry an unexpected error occurred! 😿</h1>
	<p>Please try again later.</p>
{/if}
