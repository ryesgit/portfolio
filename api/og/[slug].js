import { getBlogPostBySlug } from '../../src/services/blogService.js';

export default async function handler(req, res) {
  const { slug } = req.query;
  
  try {
    // Get blog post data
    const post = await getBlogPostBySlug(slug);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Extract first image from content
    const getFirstImageFromContent = (content) => {
      const markdownImageRegex = /!\[.*?\]\((.*?)(?:\s+".*?")?\)/;
      const match = content.match(markdownImageRegex);
      
      if (match && match[1]) {
        const imageUrl = match[1].trim();
        if (imageUrl.startsWith('http')) {
          return imageUrl;
        }
        return `https://blog.leeryan.dev${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
      }
      
      return 'https://blog.leeryan.dev/og-image.jpg';
    };
    
    const seoImage = getFirstImageFromContent(post.content);
    
    // Generate HTML with proper meta tags
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Dynamic Meta Tags for ${post.title} -->
    <title>${post.title}</title>
    <meta name="description" content="${post.excerpt}" />
    <meta name="keywords" content="${post.tags.join(', ')}, ${post.category}, blog, Lee Ryan Soliman" />
    <meta name="author" content="Lee Ryan Soliman" />
    <meta name="robots" content="index, follow" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${post.title}" />
    <meta property="og:description" content="${post.excerpt}" />
    <meta property="og:url" content="https://blog.leeryan.dev/post/${post.slug}" />
    <meta property="og:site_name" content="Chug Blogs" />
    <meta property="og:image" content="${seoImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_US" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${post.title}" />
    <meta name="twitter:description" content="${post.excerpt}" />
    <meta name="twitter:image" content="${seoImage}" />
    <meta name="twitter:creator" content="@leeryansoliman" />
    
    <!-- Article specific meta -->
    <meta property="article:author" content="Lee Ryan Soliman" />
    <meta property="article:published_time" content="${new Date(post.publishDate).toISOString()}" />
    <meta property="article:section" content="${post.category}" />
    ${post.tags.map(tag => `<meta property="article:tag" content="${tag}" />`).join('\n    ')}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://blog.leeryan.dev/post/${post.slug}" />
    
    <!-- Redirect to actual blog post -->
    <script>
      // Redirect to the React app after meta tags are read by crawlers
      if (navigator.userAgent.indexOf('bot') === -1 && navigator.userAgent.indexOf('crawl') === -1) {
        window.location.href = '/post/${post.slug}';
      }
    </script>
  </head>
  <body>
    <div id="root">
      <div style="padding: 2rem; max-width: 800px; margin: 0 auto; font-family: system-ui;">
        <h1>${post.title}</h1>
        <p style="color: #666; margin: 1rem 0;">${post.category} • ${new Date(post.publishDate).toLocaleDateString()}</p>
        <p style="line-height: 1.6;">${post.excerpt}</p>
        <p><a href="/post/${post.slug}" style="color: #dc2626;">Continue reading...</a></p>
      </div>
    </div>
    
    <!-- Load React app for regular users -->
    <script>
      if (navigator.userAgent.indexOf('bot') === -1 && navigator.userAgent.indexOf('crawl') === -1) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = '/src/blog-main.tsx';
        document.head.appendChild(script);
      }
    </script>
  </body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Error generating OG page:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}