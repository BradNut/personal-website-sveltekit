import satori from 'satori';
import type { Component } from 'svelte';
import { render } from 'svelte/server';
import { Resvg } from '@resvg/resvg-js';
import { html as toReactNode } from 'satori-html';
import { dev } from '$app/environment';
import { read } from '$app/server';

// we use a Vite plugin to turn this import into the result of fs.readFileSync during build
import firaSansSemiBold from '$lib/fonts/FiraSans-SemiBold.ttf';

const fontData = read(firaSansSemiBold).arrayBuffer();

export async function componentToPng(component: Component, props: Record<string, string | undefined>, height: number, width: number) {
  const result = render(component, { props });
  console.log('result', result);
  const markup = toReactNode(`${result.body}${result.head}`);

  const svg = await satori(markup, {
    fonts: [
      {
        name: 'Fira Sans',
        data: await fontData,
        style: 'normal',
      },
    ],
    height: +height,
    width: +width,
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: +width,
    },
  });

  const image = resvg.render();

  return new Response(image.asPng(), {
    headers: {
      'content-type': 'image/png',
      'cache-control': dev ? 'no-cache, no-store' : 'public, immutable, no-transform, max-age=86400',
    },
  });
}
