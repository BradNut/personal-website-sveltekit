import faviconPng from '#lib/assets/images/b_shell_nut_favicon.png';
import SocialImageCard from '#lib/components/socialImageCard.svelte';
import { componentToPng } from '#lib/renderImage.ts';
import { resolveSiteUrl } from '#lib/shared/siteUrl.ts';
import { read } from '$app/server';

const height = 630;
const width = 1200;

// Inline the favicon so satori never fetches it over HTTP; satori's SSRF guard rejects localhost URLs.
const faviconDataUri = read(faviconPng)
  .arrayBuffer()
  .then((buffer) => `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`);

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  try {
    const header = url.searchParams.get('header') ?? undefined;
    const page = url.searchParams.get('page') ?? undefined;
    const content = url.searchParams.get('content') ?? '';

    return componentToPng(
      // biome-ignore lint/suspicious/noExplicitAny: Svelte component type cast for renderer
      SocialImageCard as any,
      {
        header,
        page,
        content,
        image: await faviconDataUri,
        width: `${width}`,
        height: `${height}`,
        url: resolveSiteUrl(url),
      },
      height,
      width,
    );
  } catch (e) {
    console.error(e);
  }
}
