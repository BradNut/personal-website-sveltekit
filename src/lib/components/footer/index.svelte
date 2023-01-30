<script lang="ts">
	import { page } from '$app/stores';
	import ContactHub from '$lib/components/contactHub/index.svelte';
	const userNames = {
    github: 'BradNut',
    linkedIn: 'bradley-shellnut',
    email: 'bradleyshellnut@pm.me',
  };
</script>

<footer>
	<ContactHub showGithub showLinkedIn showEmail justify {userNames} />
	<nav class="footer-list" aria-label="footer navigation">
		<a class:active={$page.url.pathname === '/'} href="/">Home</a>
		<a class:active={$page.url.pathname === '/about'} href="/about">About</a>
		<a class:active={$page.url.pathname === '/portfolio'} href="/portfolio">Portfolio</a>
		<a class:active={$page.url.pathname === '/uses'} href="/uses">Uses</a>
		<a class:active={$page.url.pathname === '/privacy'} href="/privacy">Privacy</a>
		<a class:active={$page.url.pathname === '/articles'} href="/articles">Favorite Articles</a>
	</nav>
	<!-- <p className="center"> -->
	<p>
		Bradley Shellnut &copy; 2012 - {new Date().getFullYear()}
	</p>
</footer>

<style lang="postcss">
	footer {
		display: grid;
		grid-template-rows: repeat(3, 1fr);
		background: var(--footerBackground);
		place-content: center;
		place-items: center;
		padding: 2rem;

		@media (max-width: 800px) {
			margin-top: 2rem;
		}
	}

  hr {
    display: block;
    max-width: 100%;
    height: 0;
    max-height: 0;
    border: solid;
    width: 100%;
    border-width: thin 0 0 0;
    transition: inherit;
    border-color: var(--lightShade);
    color: var(--lightShade);
  }

  p {
    margin: 0;
    padding: 0.2rem;
    font-weight: 600;
		text-align: center;
    color: var(--lightShade);
  }

  ul {
    margin: 0.5rem;
  }

	.footer-list {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: space-evenly;
		gap: 1rem;
	}

	a {
		margin: 1rem;
		line-height: 1rem;
	}
</style>