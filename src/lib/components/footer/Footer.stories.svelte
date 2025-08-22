<script context="module" lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Footer from './index.svelte';

  const { Story } = defineMeta({
    title: 'Components/Footer',
    component: Footer,
    tags: ['autodocs']
  });
</script>

<Story name="Default" />
