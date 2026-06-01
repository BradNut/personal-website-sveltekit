import SocialImageCard from '$lib/components/socialImageCard.svelte';
import { componentToPng } from '$lib/renderImage';
import { resolveAssetUrl, resolveSiteUrl } from '$lib/shared/siteUrl';

const height = 630;
const width = 1200;

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  try {
    const faviconImageName = 'b_shell_nut_favicon.png';
    const image = resolveAssetUrl(url, faviconImageName);
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
        image,
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
