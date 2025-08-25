// Stop warnings of all imports from your image assets directory.

// Enhanced images (?enhanced) provide a Picture for <enhanced:img>
declare module '$lib/assets/*?enhanced' {
 import type { Picture } from '@sveltejs/enhanced-img';
 const picture: Picture;
 export default picture;
}

// Plain asset imports fallback to string URLs
declare module '$lib/assets/*' {
 const src: string;
 export default src;
}
