import meta from '$lib/assets/images/Bradley_Shellnut_New_Site.png?metadata';
import formatMeta from '$lib/assets/images/Bradley_Shellnut_New_Site.png?format=webp;avif;png&metadata';
import placeholder from '$lib/assets/images/Bradley_Shellnut_New_Site.png?w=100&png&blur=10';

type ImageMeta = {
	format: string;
	src: string;
	type: string;
	width: string;
	height: string;
};

type Sources = {
	srcset: URL;
	type: string;
	width: string;
	height: string;
};

const { height, src, width }: ImageMeta = meta;

const sources: Sources[] = [];
const imageFormatsMetadata: ImageMeta[] = JSON.parse(formatMeta);
console.log(`Image format metadata: ${JSON.parse(imageFormatsMetadata)}`);
for (const metadata of imageFormatsMetadata) {
	sources.push({
		srcset: new URL(metadata.src),
		type: `image/${metadata.format}`,
		width: metadata.width,
		height: metadata.height
	});
}

const data = {
	alt: 'Home Page of bradleyshellnut.com',
	width,
	height,
	src,
	sources,
	placeholder
};

export { data as default };
