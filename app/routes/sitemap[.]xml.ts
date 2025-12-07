import type { LoaderFunctionArgs } from "react-router";
import { getBlogPosts, getBlogMetaServer } from "~/lib/blog.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [posts, meta] = await Promise.all([
    getBlogPosts(),
    getBlogMetaServer()
  ]);

  const siteUrl = meta?.siteUrl || "https://blog.leeryan.dev";
  
  const postItems = posts.map((post) => {
    return `
    <url>
      <loc>${siteUrl}/post/${post.slug}</loc>
      <lastmod>${post.publishDate}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
    `;
  }).join("");

  const content = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${siteUrl}/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${postItems}
    </urlset>
  `;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      "encoding": "UTF-8",
    },
  });
};
