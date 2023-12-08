import type { RequestHandler } from '@sveltejs/kit';
import { PUBLIC_URL } from '$env/static/public';
import { WALLABAG_MAX_PAGES } from '$env/static/private';

const site = `https://${PUBLIC_URL}`;

export const GET: RequestHandler = async function GET({ setHeaders }) {
	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
      xmlns:xhtml="https://www.w3.org/1999/xhtml"
      xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
      <url>
        <loc>${site}</loc>
        <changefreq>daily</changefreq>
        <priority>1</priority>
      </url>

      <url>
        <loc>${site}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.4</priority>
      </url>

      <url>
        <loc>${site}/articles</loc>
        <changefreq>weekly</changefreq>
        <priority>1</priority>
      </url>

      ${Array.from({ length: parseInt(WALLABAG_MAX_PAGES) }, (_, i) => {
        return `
          <url>
            <loc>${site}/articles/${i + 1}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `;
      })}

			<url>
        <loc>${site}/portfolio</loc>
        <changefreq>monthly</changefreq>
        <priority>0.4</priority>
      </url>
			<url>
        <loc>${site}/privacy</loc>
        <changefreq>monthly</changefreq>
        <priority>0.1</priority>
      </url>
			<url>
        <loc>${site}/uses</loc>
        <changefreq>monthly</changefreq>
        <priority>0.4</priority>
      </url>
    </urlset>
  `;

	setHeaders({
		'cache-control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml'
	});

	return new Response(xml);
};
