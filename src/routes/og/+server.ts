import SocialImageCard from '$lib/components/socialImageCard.svelte';
import { componentToPng } from '$root/lib/renderImage';

const height = 630;
const width = 1200;

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		const faviconImageName = 'b_shell_nut_favicon.png';
		const image = `${new URL(url.origin).href}${faviconImageName}`;
		const header = url.searchParams.get('header') ?? undefined;
		const page = url.searchParams.get('page') ?? undefined;
		const content = url.searchParams.get('content') ?? '';

		// @ts-expect-error: Argument of type 'typeof SocialImageCard__SvelteComponent_' is not assignable to parameter of type 'SvelteComponent<any, any, any>'
		return componentToPng(SocialImageCard, {
			header,
			page,
			content,
			image,
			width: `${width}`,
			height: `${height}`,
			url: new URL(url.origin).href
		}, height, width);
	} catch (e) {
		console.error(e);
	}
}
