<script context="module" lang="ts">
import { defineMeta } from '@storybook/addon-svelte-csf';
import ArticlesSkeleton from './ArticlesSkeleton.svelte';

const { Story } = defineMeta({
  title: 'Components/ArticlesSkeleton',
  component: ArticlesSkeleton,
  tags: ['autodocs'],
  args: { count: 6, classes: [] },
});
</script>

<Story name="Default" />
