<script context="module" lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Nav from './index.svelte';

  const { Story } = defineMeta({
    title: 'Components/Nav',
    component: Nav,
    tags: ['autodocs']
  });
</script>

<Story name="Default" />
