<script lang="ts">
  import { ArrowRight } from "@lucide/svelte";
  import { Button } from "bits-ui";
  import { page } from "$app/state";
  import ArticlesSkeleton from "$lib/components/ArticlesSkeleton.svelte";
  import type { Article } from "$lib/types/article";
  import ExternalLink from "./ExternalLink.svelte";
  import Tag from "./Tag.svelte";

  type LoadData = {
    articles: Article[];
    totalArticles: number;
    classes?: string[];
    compact?: boolean;
    loading?: boolean;
  };

  const { data }: { data: LoadData } = $props();

  // Use $derived to maintain reactivity when data prop changes
  const articles = $derived(data.articles || []);
  const totalArticles = $derived(data.totalArticles || 0);
  const compact = $derived(data.compact);
  const classes = $derived(data.classes || []);
  const loading = $derived(data.loading ?? false);
</script>

<section class="articles">
  <h2>Favorite Articles</h2>
  <div class={classes.join(" ")}>
    {#if loading}
      <ArticlesSkeleton count={6} />
    {:else}
      {#each articles as article (article.hashed_url)}
        <article class="card">
          <section>
            <h3>
              <ExternalLink
                textData={{
                  text: compact
                    ? article.title.substring(0, 50).trim()
                    : article.title,
                  location: "left",
                  showIcon: true,
                }}
                linkData={{
                  href: article.url.toString(),
                  ariaLabel: `Link to ${article.title}`,
                  title: `Link to ${article.title}`,
                  target: "_blank",
                }}
              />
            </h3>
            <p class="meta">{article.domain_name}</p>
          </section>
          <section>
            <p class="meta">Reading time: {article.reading_time} minutes</p>
            <div class="tagsStyles">
              <span class="tags-label">Tags:</span>
              {#each article.tags as tag (tag)}
                <Tag name={tag} />
              {/each}
            </div>
          </section>
        </article>
      {/each}
    {/if}
  </div>
  {#if page.url.pathname === "/"}
    <Button.Root
      class="moreArticles"
      href="/articles/1"
      data-umami-event="View More Articles"
      data-umami-event-count={totalArticles}
    >
      {`${totalArticles} more articles`} <ArrowRight />
    </Button.Root>
  {/if}
</section>

<style lang="postcss">
  article {
    margin: 1.5rem 0;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--level-4);
    }

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
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-height: 800px;
    gap: 2.5rem;

    @media (max-width: 1000px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      min-height: auto;
    }

    @media (max-width: 650px) {
      grid-template-columns: minmax(0, 1fr);
      min-height: auto;
      gap: 1.5rem;
    }
  }

  .meta {
    font-size: var(--smallText);
    color: var(--textColor);
  }

  .tagsStyles {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left;
    align-items: center;

    & span {
      font-size: var(--smallText);
    }
  }

  .tagsStyles .tags-label {
    font-size: var(--bodyTextSize);
  }

  :global(.moreArticles) {
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
