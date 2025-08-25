<script context="module" lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Pagination from './Pagination.svelte';

  const { Story } = defineMeta({
    title: 'Components/Pagination',
    component: Pagination,
    tags: ['autodocs'],
    args: { additionalClasses: '', pageSize: 10, totalCount: 50, currentPage: 1, base: '/page' },
    argTypes: {
      additionalClasses: { control: 'text' },
      pageSize: { control: { type: 'number', min: 1, step: 1 } },
      totalCount: { control: { type: 'number', min: 0, step: 1 } },
      currentPage: { control: { type: 'number', min: 1, step: 1 } },
      base: { control: 'text' }
    }
  });
</script>

<Story name="Default" />
