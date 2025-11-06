<script lang="ts">
import { page } from '$app/state';
</script>

<header aria-label="header navigation">
	<nav>
		<a href="/" class:active={page.url.pathname === '/'}>Home</a>
		<a
			href="/about"
			class:active={page.url.pathname === '/about'}
		>
			About
		</a>
		<a
			href="/portfolio"
			class:active={page.url.pathname === '/portfolio'}
		>
			Portfolio
		</a>
		<a
			href="/uses"
			class:active={page.url.pathname === '/uses'}
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