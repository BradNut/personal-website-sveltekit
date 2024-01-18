<script lang="ts">
	import type { PageData } from '../$types';
	import * as m from "$paraglide/messages";
	import Bandcamp from '$lib/components/bandcamp/index.svelte';
	import Articles from '$lib/components/Articles.svelte';
	import type { Album } from '$lib/types/album';
	import type { Article, ArticlePageLoad } from '$lib/types/article';
	import { languageTag } from '$paraglide/runtime';

	export let data: PageData;
	let albums: Album[];
	let articlesData: ArticlePageLoad;
	let articles: Article[];
	let totalArticles: number;
	$: ({ albums, articlesData } = data);
	$: ({ articles, totalArticles } = articlesData);
	$: lang = languageTag();

  const userNames = {
    github: 'BradNut',
    linkedIn: 'bradley-shellnut',
    email: 'bradleyshellnut@pm.me',
  };
</script>

<div class="home">
	<div>
		<h1>{m.home_title()}</h1>
	</div>
	<p>
		{m.home_about()}
	</p>
	<p>
		{m.home_learning()}
	</p>
	<p>
		{m.home_other_about_me()}{' '}
		<a
			target="_blank"
			href="https://kindredcocktails.com"
			rel="noreferrer"
		>
			{m.cocktails()}
		</a>
		{m.home_fun_with_cats()}
	</p>
	<p>
		{m.home_check_me_out()}
		<a
			href={`https://www.linkedin.com/in/${userNames.linkedIn}`}
			target="_blank"
			aria-label={`${m.contact_through()} LinkedIn`}
			rel="noreferrer"
		>
			LinkedIn
		</a>
		,
		<a
			href={`https://www.github.com/${userNames.github}`}
			target="_blank"
			aria-label={`${m.contact_through()} Github`}
			rel="noreferrer"
		>
			Github
		</a>
		, {m.read_more()}
		<a href={`/${lang}/${m.nav_about_link()}`}>
			{m.about_me()}
		</a>.
	</p>
	<div class="social-info">
		<Bandcamp {albums} />
		<Articles {articles} {totalArticles} compact />
	</div>
</div>

<style lang="postcss">
	.home {
		display: grid;
		gap: 0.5rem;
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
