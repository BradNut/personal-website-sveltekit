export const prerender = true;
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, setHeaders }) => {
	const personalSitePromise = import('../../lib/components/portfolio/personal/personal-site.js');
	const weddingSitePromise = import('../../lib/components/portfolio/personal/wedding-website.js');
	const oldPersonalSitePromise = import('../../lib/components/portfolio/personal/old-website.js');
	const markShellnutSitePromise = import(
		'../../lib/components/portfolio/professional/mark-shellnut.js'
	);

	const [personalSiteResult, weddingSiteResult, oldPersonalSiteResult, markShellnutSiteResult] =
		await Promise.all([
			personalSitePromise,
			weddingSitePromise,
			oldPersonalSitePromise,
			markShellnutSitePromise
		]);

	// console.log(`Personal Site Result: ${JSON.stringify(personalSiteResult)}`);

	return {
		personalSiteData: personalSiteResult.default,
		weddingSiteData: weddingSiteResult.default,
		oldPersonalSiteData: oldPersonalSiteResult.default,
		markShellnutSiteData: markShellnutSiteResult.default
	};
};
