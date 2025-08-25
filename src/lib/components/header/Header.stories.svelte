<script context="module" lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Header from './index.svelte';

  const { Story } = defineMeta({
    title: 'Components/Header',
    component: Header,
    tags: ['autodocs']
  });
</script>

<Story name="Default" />
