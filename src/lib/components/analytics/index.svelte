<script lang="ts">
	import { ENV } from "varlock/env";
</script>

<svelte:head>
	<script
		async
		defer
		data-website-id={ENV.PUBLIC_UMAMI_ID}
		data-do-not-track={ENV.PUBLIC_UMAMI_DO_NOT_TRACK}
		src={ENV.PUBLIC_UMAMI_URL}
	></script>
</svelte:head>
