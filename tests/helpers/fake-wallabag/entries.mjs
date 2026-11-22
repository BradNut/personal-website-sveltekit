// The fake Wallabag's entries and its `tags` filter, shared by `server.mjs` and `fixture.ts` so the
// published page count and the unpublished titles the tests expect are derived from the same data.
import { readFileSync } from 'node:fs';

/** @typedef {{ id: number; label: string; slug: string }} FakeTag */
/** @typedef {{ id: number; title: string; tags: FakeTag[] } & Record<string, unknown>} FakeEntry */

/** @type {FakeEntry[]} */
export const entries = JSON.parse(readFileSync(new URL('./entries.json', import.meta.url), 'utf8')).items;

/**
 * Entries matching Wallabag's `tags` query param: a comma-separated list of tag labels, all of which
 * an entry must carry. An empty or missing param matches every entry.
 * @param {string | null} tagsParam
 * @returns {FakeEntry[]}
 */
export function entriesTagged(tagsParam) {
  const wanted = (tagsParam ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  return entries.filter((entry) => wanted.every((label) => entry.tags.some((tag) => tag.label === label)));
}
