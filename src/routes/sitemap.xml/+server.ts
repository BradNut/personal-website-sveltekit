import type { RequestHandler } from '@sveltejs/kit';
import { resolveSitemapUrl } from '$lib/shared/siteUrl';
import type { ArticlePageLoad } from '$lib/types/article';

export const GET: RequestHandler = async function GET({ fetch, setHeaders }) {
  const resp = await fetch('/api/articles');
  const { totalPages }: ArticlePageLoad = await resp.json();

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
        <loc>${resolveSitemapUrl('/')}</loc>
        <changefreq>daily</changefreq>
        <priority>1</priority>
      </url>

      <url>
        <loc>${resolveSitemapUrl('/about')}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.4</priority>
      </url>

      <url>
        <loc>${resolveSitemapUrl('/articles')}</loc>
        <changefreq>weekly</changefreq>
        <priority>1</priority>
      </url>

      ${Array.from({ length: totalPages }, (_, i) => {
        return `
          <url>
            <loc>${resolveSitemapUrl(`/articles/${i + 1}`)}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `;
      })}

			<url>
        <loc>${resolveSitemapUrl('/portfolio')}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.4</priority>
      </url>
			<url>
        <loc>${resolveSitemapUrl('/privacy')}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.1</priority>
      </url>
			<url>
        <loc>${resolveSitemapUrl('/uses')}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.4</priority>
      </url>
    </urlset>
  `;

  setHeaders({
    'cache-control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml',
  });

  return new Response(xml);
};
