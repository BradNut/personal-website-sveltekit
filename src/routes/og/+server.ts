import SocialImageCard from '$lib/components/socialImageCard.svelte';
import { componentToPng } from '$root/lib/renderImage';

const height = 630;
const width = 1200;

export async function GET({ url }) {
	try {
		const ogImage = `${new URL(url.origin).href}/b_shell_nut_favicon.png`;
		const header = url.searchParams.get('header') ?? undefined;
		const page = url.searchParams.get('page') ?? undefined;
		const content = url.searchParams.get('content') ?? '';

		return componentToPng(SocialImageCard, {
			header,
			page,
			content,
			image: ogImage,
			width: `${width}`,
			height: `${height}`,
			url: new URL(url.origin).href
		}, height, width);
	} catch (e) {
		console.error(e);
	}
}
