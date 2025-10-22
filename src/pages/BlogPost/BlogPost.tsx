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
      <div className={`${dark ? "dark" : "light"}`}>
        <Container>
          <main id="main-content">
            <div className="blog-post-loading">
              <div className="loading-spinner"></div>
              <p>Loading post...</p>
            </div>
          </main>
        </Container>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={`${dark ? "dark" : "light"}`}>
        <Container>
          <main id="main-content">
            <Dashes color="indianred" />
            <div className="blog-post-error">
              <h1>Post Not Found</h1>
              <p>{error || 'The blog post you are looking for does not exist.'}</p>
              <Link to="/" className="back-home-link">
                ← Back to Blog
              </Link>
            </div>
            <Dashes color="indianred" />
          </main>
        </Container>
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
      
      <div className={`${dark ? "dark" : "light"}`}>
        <Container>
          <main id="main-content">
            <Dashes color="indianred" />
            
            <article className="blog-post-detail">
              <div className="post-header">
                <Link to="/" className="back-link">
                  ← Back to Blog
                </Link>
                
                <div className="post-meta">
                  <span className="post-category">{post.category}</span>
                  <span className="post-date">{formatDate(post.publishDate)}</span>
                  <span className="read-time">{post.readTime} min read</span>
                </div>
                
                <h1 className="post-title">{post.title}</h1>
                
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="post-content markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    img: ({ src, alt, ...props }) => (
                      <img 
                        src={src} 
                        alt={alt} 
                        className="markdown-image"
                        loading="lazy"
                        {...props}
                      />
                    ),
                    code: ({ children, className, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return match ? (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className="inline-code" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
              
              <div className="post-footer">
                <div className="post-info">
                  <p className="post-excerpt-footer">
                    <strong>Summary:</strong> {post.excerpt}
                  </p>
                </div>
                
                <div className="post-navigation">
                  <Link to="/" className="nav-button">
                    ← All Posts
                  </Link>
                </div>
              </div>
            </article>
            
            <Dashes color="indianred" />
          </main>
          <aside>
            <footer style={{
              textAlign: "center",
              padding: "1rem 2rem",
            }}>
              © Soliman, {new Date().getFullYear()}
            </footer>
          </aside>
        </Container>
      </div>
    </>
  );
}

export default BlogPost;