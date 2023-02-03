import { error, type ServerLoad } from '@sveltejs/kit';
import { fetchArticlesApi } from './api';
// import type { PageServerLoad } from './$types';

export const load: ServerLoad = async ({ isDataRequest, cookies, params, setHeaders }) => {
	const queryParams = {
		// ids: `${params?.id}`,
		// fields:
		// 	'id,name,price,min_age,min_players,max_players,thumb_url,playtime,min_playtime,max_playtime,min_age,description,year_published,url,image_url'
	};

	const initialRequest = !isDataRequest;
	console.log(`Is initialRequest: ${initialRequest}`);

	const cacheValue = `${initialRequest ? +new Date() : cookies.get('articles-cache')}`;
	console.log(`Cache Value: ${cacheValue}`);

	if (initialRequest) {
		cookies.set('articles-cache', cacheValue, { path: '/', httpOnly: false });
	}

	return {
		articlesCacheBust: cacheValue
	};
};
