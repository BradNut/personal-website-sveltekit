<script context="module" lang="ts">
import { defineMeta } from '@storybook/addon-svelte-csf';
import SocialImageCard from './socialImageCard.svelte';

const { Story } = defineMeta({
  title: 'Components/SocialImageCard',
  component: SocialImageCard,
  tags: ['autodocs'],
  args: {
    header: 'Bradley Shellnut',
    page: 'Home',
    image: '/b_shell_nut_favicon.png',
    content: 'Welcome to my site',
    width: 800,
    height: 418,
    url: 'https://bradleyshellnut.com',
  },
  argTypes: {
    header: { control: 'text' },
    page: { control: 'text' },
    image: { control: 'text' },
    content: { control: 'text' },
    width: { control: { type: 'number', min: 100, step: 10 } },
    height: { control: { type: 'number', min: 100, step: 10 } },
    url: { control: 'text' },
  },
});
</script>

<Story name="Default" />
