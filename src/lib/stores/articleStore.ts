import { writable } from 'svelte/store';
import type { Article } from '$lib/types/article';

// Custom store
const state = () => {
	const { subscribe, set, update } = writable<Article[]>([]);

	function addAll(articles: Article[]) {
		// console.log(typeof articles);
		for (const article of articles) {
			add(article);
		}
	}

	function add(article: Article) {
		update((store) => [...store, article]);
	}

	function addSorted(article: Article, index: number) {
		update((store) => {
			store.splice(index, 0, article);
			return store;
		});
	}

	function remove(hashed_url: string) {
		update((store) => {
			const newStore = store.filter((item: Article) => item.hashed_url !== hashed_url);
			return [...newStore];
		});
	}

	function removeAll() {
		update(() => {
			return [];
		});
	}

	return { subscribe, set, update, add, addSorted, addAll, remove, removeAll };
};

export const articleStore = state();
