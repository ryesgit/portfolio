import type { LoaderFunctionArgs } from "react-router";
import { getAllBlogPosts, getBlogMetaServer } from "~/lib/blog.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const [posts, meta] = await Promise.all([
      getAllBlogPosts(),
      getBlogMetaServer()
    ]);

    console.log('Sitemap: posts found:', posts?.length || 0);
    console.log('Sitemap: meta:', meta);

    const baseUrl = meta?.siteUrl || 'https://blog.leeryan.dev';
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${posts?.map(post => `
  <url>
    <loc>${baseUrl}/post/${post.slug}</loc>
    <lastmod>${new Date(post.publishDate).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('') || ''}
</urlset>`;

    return new Response(sitemap.trim(), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}