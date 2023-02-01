import { error } from '@sveltejs/kit';
import { fetchArticlesApi } from '../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const queryParams = {
		// ids: `${params?.id}`,
		// fields:
		// 	'id,name,price,min_age,min_players,max_players,thumb_url,playtime,min_playtime,max_playtime,min_age,description,year_published,url,image_url'
	};

	try {
		const response = await fetchArticlesApi('get', `search`, queryParams);

		if (response?.articles) {
			// const gameResponse = await response.json();

			setHeaders({
				'Cache-Control': 'max-age=3600'
			});

			const articles = response.articles;
			console.log(`Found articles ${articles.length}`);

			return {};
		}
	} catch (error) {
		console.error(error);
	}

	throw error(500, 'error');
};
