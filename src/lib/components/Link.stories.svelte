<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Link from './Link.svelte';

  const { Story } = defineMeta({
    title: 'Components/Link',
    component: Link,
    tags: ['autodocs']
  });
</script>

<Story name="Default">
  <Link href="/" ariaLabel="Example link">
    <span>Go Home</span>
  </Link>
</Story>
