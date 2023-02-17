import { BANDCAMP_USERNAME } from '$env/static/private';
import scrapeIt from 'scrape-it';
import type { Album } from '../types/album';

export async function fetchBandcampAlbums() {
	try {
		const { data } = await scrapeIt(`https://bandcamp.com/${BANDCAMP_USERNAME}`, {
			collectionItems: {
				listItem: '.collection-item-container',
				data: {
					url: {
						selector: '.collection-title-details > a.item-link',
						attr: 'href'
					},
					artwork: {
						selector: 'div.collection-item-art-container a img',
						attr: 'src'
					},
					title: {
						selector: 'span.item-link-alt > div.collection-item-title'
					},
					artist: {
						selector: 'span.item-link-alt > div.collection-item-artist'
					}
				}
			}
		});

		const albums: Album[] = data?.collectionItems || [];
		// console.log(`Albums ${JSON.stringify(albums)}`);

		if (albums && albums?.length > 0) {
			return albums;
		} else {
			return [];
		}
	} catch (error) {
		console.error(error);
	}
}
