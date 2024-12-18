<script lang="ts">
  import type { Article } from '$lib/types/article';
	import { ArrowRight } from 'lucide-svelte';
  import ExternalLink from './ExternalLink.svelte';

const {
  articles,
  totalArticles,
  compact = false,
  classes = [],
}: { articles: Article[]; totalArticles: number; compact: boolean; classes?: string[] } = $props();
</script>

<section class="articles">
  <h2>Favorite Articles</h2>
  <div class={classes.join(' ')}>
    {#each articles as article (article.hashed_url)}
      <article class="card">
        <section>
          <h3>
            <ExternalLink
              textData={{
                text: compact ? article.title.substring(0, 50).trim() : article.title,
                location: 'left',
                showIcon: true,
              }}
              linkData={{
                href: article.url.toString(),
                ariaLabel: `Link to ${article.title}`,
                title: `Link to ${article.title}`,
                target: '_blank',
              }}
              iconData={{ iconClass: 'center' }}
            />
          </h3>
          <p>{article.domain_name}</p>
        </section>
        <section>
          <p>Reading time: {article.reading_time} minutes</p>
          <div class="tagsStyles">
            <p>Tags:</p>
            {#each article.tags as tag}
              <p>{tag}</p>
            {/each}
          </div>
        </section>
      </article>
    {/each}
  </div>
  <a class="moreArticles" href="/articles">{`${totalArticles} more articles`} <ArrowRight /></a>
</section>


<style lang="postcss">
	article {
    margin: 1.5rem 0;

    & p {
      margin: 0.25rem 0rem;
    }
	}

  .articles {
    display: grid;
    place-content: center;
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
    display: flex;
    flex-wrap: wrap;
    place-items: center;
    place-content: center;
    gap: 1rem;
    font-size: var(--h2);

    @media (max-width: 1000px) {
      font-size: var(--h3);
    }
  }
</style>