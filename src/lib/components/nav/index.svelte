<script lang="ts">
	import { page } from "$app/state";
</script>

<header aria-label="header navigation">
	<nav>
		<a
			href="/"
			class:active={page.url.pathname === "/"}
			data-umami-event="Navigation"
			data-umami-event-page="Home">Home</a
		>
		<a
			href="/about"
			class:active={page.url.pathname === "/about"}
			data-umami-event="Navigation"
			data-umami-event-page="About"
		>
			About
		</a>
		<a
			href="/portfolio"
			class:active={page.url.pathname === "/portfolio"}
			data-umami-event="Navigation"
			data-umami-event-page="Portfolio"
		>
			Portfolio
		</a>
		<a
			href="/uses"
			class:active={page.url.pathname === "/uses"}
			data-umami-event="Navigation"
			data-umami-event-page="Uses"
		>
			Uses
		</a>
	</nav>
</header>

<style lang="postcss">
	nav {
		display: grid;
		grid-template-columns: repeat(4, auto);
		justify-content: right;
		align-content: center;

		@media (max-width: 650px) {
			justify-content: center;
		}

		margin: 0.5rem;
		padding: 2rem;

		& a + a {
			margin-left: 25px;
		}
	}
</style>
