<script context="module" lang="ts">
import { defineMeta } from '@storybook/addon-svelte-csf';
import ContactHub from './ContactHub.svelte';

const defaultUserNames = {
  x: 'example_x',
  blueSky: 'example.bsky.social',
  linkedIn: 'example-linkedin',
  github: 'example-github',
  email: 'user@example.com',
};

const { Story } = defineMeta({
  title: 'Components/ContactHub',
  component: ContactHub,
  tags: ['autodocs'],
  args: {
    showBlueSky: true,
    showEmail: true,
    showGithub: true,
    showLinkedIn: true,
    showX: true,
    userNames: defaultUserNames,
    showText: true,
    justify: true,
  },
  argTypes: {
    showBlueSky: { control: 'boolean' },
    showEmail: { control: 'boolean' },
    showGithub: { control: 'boolean' },
    showLinkedIn: { control: 'boolean' },
    showX: { control: 'boolean' },
    showText: { control: 'boolean' },
    justify: { control: 'boolean' },
    userNames: { control: 'object' },
  },
});
</script>

<Story name="Default" />
