// This API route serves SEO-optimized HTML for social media crawlers
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Extract first image from markdown content
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
  
  return null;
};

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
    // Fetch post data from Firestore
    const postsRef = collection(db, 'blogPosts');
    const q = query(postsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    let post = null;
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      post = { id: doc.id, ...doc.data() };
    }
    
    if (!post) {
      // Post not found, serve 404
      return res.status(404).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Post Not Found - Chug Blogs</title>
    <meta name="description" content="The requested blog post was not found." />
  </head>
  <body>
    <h1>Post Not Found</h1>
    <p><a href="https://blog.leeryan.dev">Return to Blog</a></p>
  </body>
</html>`);
    }
    
    // Get first image from post content
    const firstImage = getFirstImageFromContent(post.content);
    const seoImage = firstImage || "https://blog.leeryan.dev/og-image.jpg";
    
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary Meta Tags -->
    <title>${post.title}</title>
    <meta name="title" content="${post.title}" />
    <meta name="description" content="${post.excerpt}" />
    <meta name="keywords" content="${post.tags.join(', ')}, ${post.category}, blog, Lee Ryan Soliman" />
    <meta name="author" content="Lee Ryan Soliman" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${post.title}" />
    <meta property="og:description" content="${post.excerpt}" />
    <meta property="og:url" content="https://blog.leeryan.dev/post/${post.slug}" />
    <meta property="og:site_name" content="Chug Blogs" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="${seoImage}" />
    <meta property="og:image:alt" content="Featured image for ${post.title}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${post.title}" />
    <meta name="twitter:description" content="${post.excerpt}" />
    <meta name="twitter:url" content="https://blog.leeryan.dev/post/${post.slug}" />
    <meta name="twitter:creator" content="@leeryansoliman" />
    <meta name="twitter:image" content="${seoImage}" />
    <meta name="twitter:image:alt" content="Featured image for ${post.title}" />
    
    <!-- Article specific meta -->
    <meta property="article:author" content="Lee Ryan Soliman" />
    <meta property="article:published_time" content="${new Date(post.publishDate).toISOString()}" />
    <meta property="article:section" content="${post.category}" />
    <meta property="article:reading_time" content="${post.readTime}" />
    ${post.tags.map(tag => `<meta property="article:tag" content="${tag}" />`).join('\n    ')}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://blog.leeryan.dev/post/${post.slug}" />
    
    <!-- Redirect for crawlers -->
    <meta http-equiv="refresh" content="0; url=https://blog.leeryan.dev/post/${post.slug}" />
  </head>
  <body>
    <h1>${post.title}</h1>
    <p>${post.excerpt}</p>
    <p><a href="https://blog.leeryan.dev/post/${post.slug}">Read the full post</a></p>
  </body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Error serving crawler content:', error);
    
    // Fallback HTML for errors
    const fallbackHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Blog Post - Chug Blogs</title>
    <meta name="description" content="Read this blog post on Chug Blogs" />
    <meta property="og:title" content="Blog Post - Chug Blogs" />
    <meta property="og:description" content="Read this blog post on Chug Blogs" />
    <meta property="og:url" content="https://blog.leeryan.dev/post/${slug}" />
    <meta property="og:image" content="https://blog.leeryan.dev/og-image.jpg" />
    <meta http-equiv="refresh" content="0; url=https://blog.leeryan.dev/post/${slug}" />
  </head>
  <body>
    <h1>Blog Post</h1>
    <p><a href="https://blog.leeryan.dev/post/${slug}">Read the full post</a></p>
  </body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(fallbackHtml);
  }
}