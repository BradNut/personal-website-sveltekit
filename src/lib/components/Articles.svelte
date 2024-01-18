<script lang="ts">
  import * as m from "$paraglide/messages";
	import type { Article } from "$lib/types/article";
	import ExternalLink from './ExternalLink.svelte';
  import { languageTag } from '$paraglide/runtime';

  export let articles: Article[];
	export let totalArticles: number;
  export let compact: boolean = false;
  export let classes: string[] = [];

  $: lang = languageTag();
</script>

<div>
  <h2>{m.articles_favorite_articles()}</h2>
  <div class={classes.join(' ')}>
    {#each articles as article (article.hashed_url)}
      <article class='card'>
        <section>
          <h3>
            <ExternalLink
              ariaLabel={`Link to ${article.title}`}
              href={article.url.toString()}
              showIcon
            >
              {#if compact}
                {article.title.substring(0, 50).trim()}
              {:else}
                {article.title}
              {/if}
            </ExternalLink>
          </h3>
        </section>
        <section>
          <p>{m.articles_reading_time()}: {article.reading_time} {article.reading_time === 1 ? m.articles_minute() : m.articles_minutes()}</p>
          <div class="tagsStyles">
            <p>{m.articles_tags()}:</p>
            {#each article.tags as tag}
              <p>{tag}</p>
            {/each}
          </div>
        </section>
      </article>
    {/each}
  </div>
  <div class="moreArticles">
    <a href={`${lang}/${m.nav_articles_link()}`}>
      {`${totalArticles} ${m.articles_more_articles()}`}
    </a>
    <a href={`${lang}/${m.nav_articles_link()}`}>
      <iconify-icon icon="material-symbols:arrow-right-alt-rounded"></iconify-icon>
    </a>
  </div>
</div>


<style lang="postcss">
	article {
    margin: 1.5rem 0;

    & p {
      margin: 0.25rem 0rem;
    }
	}

  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(250px, 1fr));
		min-height: 800px;

		@media (max-width: 1000px) {
			grid-template-columns: repeat(2, minmax(250px, 1fr));
		}

		@media (max-width: 650px) {
			grid-template-columns: minmax(250px, 1fr);
		}

		gap: 2.5rem;
  }

  .tagsStyles {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left;
    align-items: center;

    & p + p {
      background-color: var(--linkHover);
      color: var(--buttonTextColor);
      padding: 0.25rem 0.5rem;
      margin: 0.5rem;
      border-radius: 2px;
      font-size: 1.2rem;
    }
  }

  .moreArticles {
    margin: 1.7rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    & a {
      font-size: 2rem;
    }

    & a + svg {
      text-decoration: none;
    }

    @media (max-width: 1000px) {
      font-size: 1.5rem;
    }
  }
</style>