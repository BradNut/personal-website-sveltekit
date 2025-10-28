<script module lang="ts">
import { defineMeta } from '@storybook/addon-svelte-csf';
import Articles from './Articles.svelte';

const { Story } = defineMeta({
  title: 'Components/Articles',
  component: Articles,
  tags: ['autodocs'],
  args: {
    data: { articles: [], totalArticles: 0, classes: [], compact: false },
  },
  argTypes: {
    data: { control: 'object' },
  },
});
</script>

<Story name="Default" args={{ data: { articles: [], totalArticles: 0, classes: [], compact: false } }} />
