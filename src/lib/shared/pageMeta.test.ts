import { describe, expect, it } from 'vitest';

import { buildPageMetaTags } from './pageMeta.js';

function build(overrides: Partial<Parameters<typeof buildPageMetaTags>[0]> = {}) {
  return buildPageMetaTags({
    url: new URL('http://localhost:5173/about'),
    title: 'About',
    description: 'About Bradley Shellnut',
    og: { header: 'About | bradleyshellnut.com', page: 'Hey there!' },
    imageAlt: 'About Bradley Shellnut',
    ...overrides,
  });
}

describe('buildPageMetaTags', () => {
  it('mirrors title and description across top-level, openGraph, and twitter', () => {
    const meta = build();

    expect(meta.title).toBe('About');
    expect(meta.description).toBe('About Bradley Shellnut');
    expect(meta.openGraph?.title).toBe('About');
    expect(meta.openGraph?.description).toBe('About Bradley Shellnut');
    expect(meta.twitter?.title).toBe('About');
  });

  it('falls back to description for the twitter card when twitterDescription is omitted', () => {
    const meta = build({ description: 'Plain description', twitterDescription: undefined });

    expect(meta.twitter?.description).toBe('Plain description');
  });

  it('uses twitterDescription for the twitter card while leaving openGraph on description', () => {
    const meta = build({ description: 'OG description', twitterDescription: 'Tweet description' });

    expect(meta.twitter?.description).toBe('Tweet description');
    expect(meta.openGraph?.description).toBe('OG description');
  });

  it('encodes og header, page, and content into the shared og image URL', () => {
    const meta = build({
      og: { header: 'Uses | bradleyshellnut.com', page: 'What I use!', content: 'My gear.' },
    });

    const ogImage = meta.openGraph?.images?.[0]?.url ?? '';
    const params = new URL(ogImage).searchParams;

    expect(params.get('header')).toBe('Uses | bradleyshellnut.com');
    expect(params.get('page')).toBe('What I use!');
    expect(params.get('content')).toBe('My gear.');
    expect(meta.twitter?.image).toBe(ogImage);
  });

  it('omits the content query param when og.content is not provided', () => {
    const meta = build({ og: { header: 'Header', page: 'Page' } });

    const params = new URL(meta.openGraph?.images?.[0]?.url ?? '').searchParams;

    expect(params.has('content')).toBe(false);
    expect(params.get('header')).toBe('Header');
  });
});
