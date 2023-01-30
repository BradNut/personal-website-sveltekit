<script lang="ts">
	import type { PageData } from "./$types";
	import SEO from '$root/lib/components/SEO.svelte';

	export let data: PageData;
  const userNames = {
    github: 'BradNut',
    linkedIn: 'bradley-shellnut',
    email: 'bradleyshellnut@pm.me',
  };
</script>

<SEO title="Home" />

<div class="home">
	<div>
		<h1>Hello! I'm Bradley Shellnut.</h1>
	</div>
	<div>
		<p>
			I'm a full stack software engineer currently working on Java Spring, PostgreSQL, and React / Angular JS.
		</p>
		<p>
			At home you can usually find me learning new things and working with
			SvelteKit, Next.js, and Gatsby.
		</p>
		<p>
			Or you may find me jamming out to music 🎶, hiking ⛰️, making{' '}
			<a
				target="_blank"
				href="https://kindredcocktails.com"
				rel="noreferrer"
			>
				cocktails
			</a>{' '}
			🍸, or having fun with my cats. 🐈
		</p>
		<p>
			Check me out on{' '}
			<a
				href={`https://www.linkedin.com/in/${userNames.linkedIn}`}
				target="_blank"
				aria-label="Contact through LinkedIn"
				rel="noreferrer"
			>
				LinkedIn
			</a>
			,{' '}
			<a
				href={`https://www.github.com/${userNames.github}`}
				target="_blank"
				aria-label="Contact through Github"
				rel="noreferrer"
			>
				Github
			</a>
			, or read more <a href="/about">about me</a>.
		</p>
	</div>
	<div class="social-info">
		<!-- <Bandcamp /> -->
		<!-- <Articles /> -->
	</div>
</div>

<style lang="postcss">
	.home {
		display: grid;
		grid-gap: 2rem;
	}

	.social-info {
		margin-top: 2rem;
		display: grid;
		grid-template-columns: 1fr 0.5fr;
		gap: 3rem;

		@media (max-width: 1000px) {
			grid-template-columns: 1fr 0.4fr;
		}

		@media (max-width: 800px) {
			grid-template-columns: 1fr;
		}
	}
</style>
