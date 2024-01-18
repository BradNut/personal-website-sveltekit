import type { Reroute } from '@sveltejs/kit';

const translated: Record<string, string> = {
	'/en/about': '/en/about',
	'/en/uses': '/en/uses',
	'/en/articles': '/en/articles',
	'/en/portfolio': '/en/portfolio',
	'/en/privacy': '/en/privacy',
	'/es/acerca-de': '/es/about',
	'/es/utiliza': '/es/uses',
	'/es/articulos': '/es/articles',
	'/es/cartera': '/es/portfolio',
	'/es/privacidad': '/es/privacy'
};

export const reroute: Reroute = ({ url }) => {
	if (url.pathname in translated) {
		return translated[url.pathname];
	}
};