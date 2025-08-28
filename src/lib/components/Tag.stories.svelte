<script context="module" lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tag from './Tag.svelte';

  const { Story } = defineMeta({
    title: 'Components/Tag',
    component: Tag,
    tags: ['autodocs'],
    args: { name: 'JavaScript' },
    argTypes: { name: { control: 'text' } }
  });
</script>

<Story name="Default" />
