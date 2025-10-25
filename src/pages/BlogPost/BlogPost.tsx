import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import Container from '../../components/Container/index';
import Dashes from '../../components/ui/Dashes';
import { BlogPost as BlogPostType } from '../../data/blogPosts';
import { getBlogPostBySlug } from '../../services/blogService';
import BlogDarkModeContext from '../../contexts/BlogDarkModeProvider';
import './BlogPost.css';
import 'highlight.js/styles/github-dark.css';

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { dark } = useContext(BlogDarkModeContext);
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract first image from markdown content
  const getFirstImageFromContent = (content: string): string | null => {
    // Match markdown image syntax: ![alt](url) or ![alt](url "title")
    const markdownImageRegex = /!\[.*?\]\((.*?)(?:\s+".*?")?\)/;
    const match = content.match(markdownImageRegex);
    
    if (match && match[1]) {
      // Return the URL, handle relative URLs
      const imageUrl = match[1].trim();
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      // If relative URL, make it absolute
      return `https://blog.leeryan.dev${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    }
    
    return null;
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('Post not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedPost = await getBlogPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-300">Loading post...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Post Not Found</h1>
            <p className="text-gray-300 mb-6">{error || 'The blog post you are looking for does not exist.'}</p>
            <Link 
              to="/" 
              className="inline-flex items-center text-red-400 hover:text-red-500 transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get the first image from post content for SEO
  const firstImage = getFirstImageFromContent(post.content);
  const seoImage = firstImage || "https://blog.leeryan.dev/og-image.jpg";

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{post.title}</title>
        <meta name="title" content={post.title} />
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={`${post.tags.join(', ')}, ${post.category}, blog, Lee Ryan Soliman`} />
        <meta name="author" content="Lee Ryan Soliman" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`https://blog.leeryan.dev/post/${post.slug}`} />
        <meta property="og:site_name" content="Chug Blogs" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content={seoImage} />
        <meta property="og:image:alt" content={`Featured image for ${post.title}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:url" content={`https://blog.leeryan.dev/post/${post.slug}`} />
        <meta name="twitter:creator" content="@leeryansoliman" />
        <meta name="twitter:image" content={seoImage} />
        <meta name="twitter:image:alt" content={`Featured image for ${post.title}`} />
        
        {/* Article specific meta */}
        <meta property="article:author" content="Lee Ryan Soliman" />
        <meta property="article:published_time" content={new Date(post.publishDate).toISOString()} />
        <meta property="article:modified_time" content={new Date(post.publishDate).toISOString()} />
        <meta property="article:section" content={post.category} />
        <meta property="article:reading_time" content={`${post.readTime}`} />
        {post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://blog.leeryan.dev/post/${post.slug}`} />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#dc2626" />
        <meta name="msapplication-TileColor" content="#dc2626" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": seoImage,
            "author": {
              "@type": "Person",
              "name": "Lee Ryan Soliman",
              "url": "https://leeryan.dev",
              "sameAs": [
                "https://github.com/ryesgit",
                "https://linkedin.com/in/leeryansoliman"
              ]
            },
            "publisher": {
              "@type": "Person",
              "name": "Lee Ryan Soliman",
              "url": "https://leeryan.dev"
            },
            "datePublished": new Date(post.publishDate).toISOString(),
            "dateModified": new Date(post.publishDate).toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://blog.leeryan.dev/post/${post.slug}`
            },
            "url": `https://blog.leeryan.dev/post/${post.slug}`,
            "keywords": post.tags.join(', '),
            "articleSection": post.category,
            "wordCount": post.content.split(/\s+/).length,
            "timeRequired": `PT${post.readTime}M`,
            "inLanguage": "en-US",
            "copyrightYear": new Date(post.publishDate).getFullYear(),
            "copyrightHolder": {
              "@type": "Person",
              "name": "Lee Ryan Soliman"
            },
            "isPartOf": {
              "@type": "Blog",
              "name": "Chug Blogs",
              "url": "https://blog.leeryan.dev"
            }
          })}
        </script>
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://blog.leeryan.dev"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": post.category,
                "item": `https://blog.leeryan.dev?category=${post.category.toLowerCase()}`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://blog.leeryan.dev/post/${post.slug}`
              }
            ]
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8">
          {/* Navigation */}
          <nav className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-red-400 hover:text-red-500 transition-colors"
            >
              ← Back to Blog
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 leading-tight text-white">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
              <span>
                {formatDate(post.publishDate)}
              </span>
              <span>•</span>
              <span>{post.readTime} min read</span>
            </div>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Article Content */}
          <main className="max-w-none">
            <div className="prose prose-lg prose-invert prose-red max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                  // Custom styling for code blocks
                  pre: ({ children, ...props }) => (
                    <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto" {...props}>
                      {children}
                    </pre>
                  ),
                  code: ({ children, className, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="bg-gray-800 px-1 py-0.5 rounded text-red-400" {...props}>
                        {children}
                      </code>
                    );
                  },
                  // Custom styling for blockquotes
                  blockquote: ({ children, ...props }) => (
                    <blockquote className="border-l-4 border-red-600 pl-4 italic text-gray-300" {...props}>
                      {children}
                    </blockquote>
                  ),
                  // Custom styling for headings
                  h1: ({ children, ...props }) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 text-white" {...props}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className="text-2xl font-bold mt-6 mb-3 text-white" {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="text-xl font-semibold mt-4 mb-2 text-white" {...props}>
                      {children}
                    </h3>
                  ),
                  // Custom styling for links
                  a: ({ children, href, ...props }) => (
                    <a 
                      href={href}
                      className="text-red-400 hover:text-red-500 underline"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  // Custom styling for lists
                  ul: ({ children, ...props }) => (
                    <ul className="list-disc list-inside space-y-1 text-gray-300" {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="list-decimal list-inside space-y-1 text-gray-300" {...props}>
                      {children}
                    </ol>
                  ),
                  p: ({ children, ...props }) => (
                    <p className="mb-4 leading-relaxed text-gray-300" {...props}>
                      {children}
                    </p>
                  ),
                  img: ({ src, alt, ...props }) => (
                    <img 
                      src={src} 
                      alt={alt} 
                      className="rounded-lg max-w-full h-auto my-6"
                      loading="lazy"
                      {...props}
                    />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </main>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-white">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400">
              © 2025 Lee Ryan Soliman. Built with React & ❤️
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default BlogPost;