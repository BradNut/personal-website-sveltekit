// Stop warnings of all imports from your image assets directory.

declare module '$lib/assets/*' {
	const image: Record<string, any>;
	export default image;
}
