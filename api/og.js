// Firebase Admin SDK for serverless functions
const admin = require('firebase-admin');

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  try {
    // For Vercel, we can use environment variables for configuration
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

// Extract first image from markdown content
const getFirstImageFromContent = (content) => {
  if (!content) return null;
  
  // Match markdown image syntax: ![alt](url) or ![alt](url "title")
  const markdownImageRegex = /!\[.*?\]\((.*?)(?:\s+".*?")?\)/;
  const match = content.match(markdownImageRegex);
  
  if (match && match[1]) {
    const imageUrl = match[1].trim();
    // Return the URL as-is if it's already absolute
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // If relative URL, make it absolute
    return `https://blog.leeryan.dev${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
  }
  
  return null;
};

export default async function handler(req, res) {
  const { slug } = req.query;
  
  try {
    let post = null;
    
    // Fetch from Firestore using Firebase Admin SDK
    try {
      console.log('Fetching post from Firestore with Admin SDK:', slug);
      
      const db = admin.firestore();
      const postsRef = db.collection('blogPosts');
      const querySnapshot = await postsRef.where('slug', '==', slug).get();
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        post = { id: doc.id, ...doc.data() };
        console.log('Found post in Firestore:', post.title);
      } else {
        console.log('Post not found in Firestore:', slug);
      }
    } catch (firebaseError) {
      console.error('Firebase Admin error:', firebaseError);
    }
    
    if (!post) {
      // Post not found, serve 404 with fallback meta tags
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Post Not Found - Chug Blogs</title>
  <meta name="description" content="The requested blog post was not found.">
  <meta property="og:title" content="Post Not Found - Chug Blogs">
  <meta property="og:description" content="The requested blog post was not found.">
  <meta property="og:image" content="https://blog.leeryan.dev/og-image.jpg">
  <meta http-equiv="refresh" content="0; url=https://blog.leeryan.dev">
</head>
<body>
  <h1>Post Not Found</h1>
  <p><a href="https://blog.leeryan.dev">Return to Blog</a></p>
</body>
</html>`;
      
      res.setHeader('Content-Type', 'text/html');
      res.status(404).send(html);
      return;
    }
    
    // Get first image from post content
    const firstImage = getFirstImageFromContent(post.content);
    const seoImage = firstImage || "https://blog.leeryan.dev/og-image.jpg";
    
    console.log('Using SEO image:', seoImage);
    
    // Use actual post data for meta tags
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Dynamic Meta Tags with Real Post Data -->
  <title>${post.title}</title>
  <meta name="description" content="${post.excerpt}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.excerpt}">
  <meta property="og:url" content="https://blog.leeryan.dev/post/${post.slug}">
  <meta property="og:site_name" content="Chug Blogs">
  <meta property="og:image" content="${seoImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${post.title}">
  <meta name="twitter:description" content="${post.excerpt}">
  <meta name="twitter:image" content="${seoImage}">
  <meta name="twitter:creator" content="@leeryansoliman">
  
  <!-- Article Meta -->
  <meta property="article:author" content="Lee Ryan Soliman">
  <meta property="article:published_time" content="${post.publishDate ? new Date(post.publishDate).toISOString() : ''}">
  <meta property="article:section" content="${post.category || 'Blog'}">
  <meta property="article:reading_time" content="${post.readTime || 5}">
  ${(post.tags || []).map(tag => `<meta property="article:tag" content="${tag}">`).join('\n  ')}
  
  <!-- Canonical and Additional SEO -->
  <link rel="canonical" href="https://blog.leeryan.dev/post/${post.slug}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#dc2626">
  
  <!-- HTTP refresh instead of JavaScript -->
  <meta http-equiv="refresh" content="0; url=https://blog.leeryan.dev/post/${post.slug}">
</head>
<body>
  <h1>${post.title}</h1>
  <p>${post.excerpt}</p>
  <p><a href="https://blog.leeryan.dev/post/${post.slug}">Continue reading on Chug Blogs →</a></p>
  <noscript>
    <p><a href="https://blog.leeryan.dev/post/${post.slug}">View the full post</a></p>
  </noscript>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Error serving crawler content:', error);
    
    // Fallback HTML for errors
    const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Blog Post - Chug Blogs</title>
  <meta name="description" content="Read this blog post on Chug Blogs by Lee Ryan Soliman.">
  <meta property="og:title" content="Blog Post - Chug Blogs">
  <meta property="og:description" content="Read this blog post on Chug Blogs by Lee Ryan Soliman.">
  <meta property="og:url" content="https://blog.leeryan.dev/post/${slug}">
  <meta property="og:image" content="https://blog.leeryan.dev/og-image.jpg">
  <meta http-equiv="refresh" content="0; url=https://blog.leeryan.dev/post/${slug}">
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