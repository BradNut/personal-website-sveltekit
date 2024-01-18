<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { translatePath } from '$root/lib/i18n-routing';
	import { availableLanguageTags, languageTag } from '$paraglide/runtime';
	import * as m from "$paraglide/messages";

	$: pathname = $page.url.pathname;
	$: console.log('pathname', pathname)
	$: lang = languageTag();
	$: console.log('lang', lang);
</script>

<header aria-label="header navigation">
	<nav>
		<a href='/' class:active={pathname === '/'}>{m.nav_home()}</a>
		<a
			href={`/${lang}/${m.nav_about_link()}`}
			class:active={pathname === `/${lang}/${m.nav_about_link()}`}
		>
			{m.nav_about()}
		</a>
		<a
			href={`/${lang}/${m.nav_portfolio_link()}`}
			class:active={pathname === `/${lang}/${m.nav_portfolio_link()}`}
		>
			{m.nav_portfolio()}
		</a>
		<a
			href={`/${lang}/${m.nav_uses_link()}`}
			class:active={pathname === `/${lang}/${m.nav_uses_link()}`}
		>
			{m.nav_uses()}
		</a>
		<select on:change={(e) => goto(translatePath(pathname, e?.target?.value))}>
			{#each availableLanguageTags as lang}
				<option value={lang} selected={lang === languageTag()}>{lang}</option>
			{/each}
		</select>
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