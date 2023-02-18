<script lang="ts">
  import OpenInNew from '@iconify-icons/mdi/open-in-new';
	import type { Article } from "$root/lib/types/article";

  export let articles: Article[];
	export let totalArticles: number;
  export let compact: boolean = false;
</script>

    <div>
      <h2>Favorite Articles</h2>
      <div style="display: grid;">
        {#each articles as article}
          <article class="articleStyles card">
            <section>
              <h3>
                <a
                  target="_blank"
                  title={`Link to ${article.title}`}
                  aria-label={`Link to ${article.title}`}
                  href={article.url.toString()}
                  rel="noreferrer"
                >
                  {#if compact}
                    {article.title.substring(0, 50).trim()}&#8230;
                  {:else}
                    {article.title}
                  {/if}
                  <iconify-icon icon={OpenInNew} width="24" height="24" role="img" title="Open Article Externally" />
                </a>{' '}
              </h3>
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
      <div class="moreArticlesStyles">
        <a href="/articles">{`${totalArticles} more articles`}</a>
        <a href="/articles" aria-label={`${totalArticles} more articles`}>
					<iconify-icon icon="material-symbols:arrow-right-alt-rounded"></iconify-icon>
        </a>
      </div>
    </div>


<style lang="postcss">
	.articleStyles {
    display: grid;
    grid-template-rows: repeat(1fr, 3);
    gap: 0.5rem;
    margin: 1.5rem 0;

    a {
      overflow-wrap: anywhere;
    }

    p {
      margin: 0.4rem 0.25rem;
    }
	}

  .tagsStyles {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left;
    align-items: center;

    p + p {
      background-color: var(--linkHover);
      color: var(--buttonTextColor);
      padding: 0.25rem 0.5rem;
      margin: 0.5rem;
      border-radius: 2px;
      font-size: 1.2rem;
    }
  }

  .moreArticlesStyles {
    margin: 1.7rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    a {
      font-size: 2rem;
      svg {
        text-decoration: none;
      }
    }

    @media (max-width: 1000px) {
      font-size: 1.5rem;
    }
  }
</style>