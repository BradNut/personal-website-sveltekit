<script context="module" lang="ts">
import { defineMeta } from '@storybook/addon-svelte-csf';
import LazyImage from './LazyImage.svelte';

const sampleSrc = {
  img: { src: 'https://picsum.photos/400/300', w: 400, h: 300 },
  sources: {
    avif: 'https://picsum.photos/400/300.avif',
    webp: 'https://picsum.photos/400/300.webp',
    jpg: 'https://picsum.photos/400/300.jpg',
  },
};

const { Story } = defineMeta({
  title: 'Components/LazyImage',
  component: LazyImage,
  tags: ['autodocs'],
  args: { clazz: 'demo-image', src: sampleSrc, alt: 'Random image', style: '', loading: 'lazy' },
  argTypes: {
    clazz: { control: 'text' },
    src: { control: 'object' },
    alt: { control: 'text' },
    style: { control: 'text' },
    loading: { control: { type: 'select' }, options: ['lazy', 'eager'] },
  },
});
</script>

<Story name="Default" />
