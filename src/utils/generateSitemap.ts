import { getBlogPosts } from '../services/blogService';

export const generateSitemap = async (): Promise<string> => {
  const posts = await getBlogPosts();
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls = [
    {
      loc: 'https://blog.leeryan.dev',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    ...posts.map(post => ({
      loc: `https://blog.leeryan.dev/post/${post.slug}`,
      lastmod: post.publishDate || currentDate,
      changefreq: 'monthly' as const,
      priority: '0.8'
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};