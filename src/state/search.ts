import { writable } from 'svelte/store';
import { persisted } from 'svelte-local-storage-store';

export const searching = writable(false);
export const overlay_open = writable(false);
export const search_query = writable('');
export const search_recent = persisted<string[]>('svelte:recent-searches', []);
