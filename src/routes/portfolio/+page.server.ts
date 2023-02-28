import { error } from '@sveltejs/kit';
import { compile } from 'mdsvex';
import type { PageServerLoad } from '../$types';
export const prerender = true;

export const load: PageServerLoad = async () => {
	try {
		const personalSiteGatsby = await import(
			`../../lib/content/portfolio/personal/personal-website-gatsby.md`
		);

		const { default: page, metadata } = personalSiteGatsby;

		// const [personalSiteGatsbyResponse] = await Promise.all([personalSiteGatsby]);

		console.log(`page: ${JSON.stringify(page)}, metadata: ${JSON.stringify(metadata)}`);

		// const compiledResponse = await compile(personalSiteGatsbyResponse);

		// console.log(`compiledResponse is: ${JSON.stringify(compiledResponse)}`);
		return {
			portfolios: ''
		};
	} catch (e) {
		console.error(e);
		throw error(500, 'Error loading portfolios');
	}
};
