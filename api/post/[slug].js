// This API route serves SEO-optimized HTML for social media crawlers
export default async function handler(req, res) {
  const { slug } = req.query;
  const userAgent = req.headers['user-agent'] || '';
  
  // Check if it's a social media crawler
  const isCrawler = /bot|crawl|slurp|spider|facebook|twitter|linkedin|whatsapp/i.test(userAgent);
  
  if (!isCrawler) {
    // Redirect regular users to the React app
    return res.redirect(302, `/post/${slug}`);
  }
  
  try {
    // For crawlers, fetch post data and serve static HTML
    // Note: You'll need to implement getBlogPostBySlug for the API environment
    
    // For now, let's create a basic HTML structure
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- This will be replaced with actual post data -->
    <title>Blog Post - Chug Blogs</title>
    <meta name="description" content="Read this blog post on Chug Blogs" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="Blog Post - Chug Blogs" />
    <meta property="og:description" content="Read this blog post on Chug Blogs" />
    <meta property="og:url" content="https://blog.leeryan.dev/post/${slug}" />
    <meta property="og:site_name" content="Chug Blogs" />
    <meta property="og:image" content="https://blog.leeryan.dev/og-image.jpg" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Blog Post - Chug Blogs" />
    <meta name="twitter:description" content="Read this blog post on Chug Blogs" />
    <meta name="twitter:image" content="https://blog.leeryan.dev/og-image.jpg" />
  </head>
  <body>
    <h1>Blog Post</h1>
    <p>This post is loading... <a href="https://blog.leeryan.dev/post/${slug}">Click here to read it</a></p>
  </body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Error serving crawler content:', error);
    res.redirect(302, `/post/${slug}`);
  }
}