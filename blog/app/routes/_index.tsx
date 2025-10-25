import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import BlogSidebar from "~/components/BlogSidebar";
import type { BlogPost } from "~/lib/blog.client";
import "~/styles/blog.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Chug Blogs - Tech, Science, Life & Meta Thoughts" },
    { name: "description", content: "Personal blog by Lee Ryan Soliman featuring thoughts on technology, science, life, and meta topics. Explore insights from a software engineer's perspective." },
    { name: "keywords", content: "blog, technology, science, life, meta, software engineering, programming, web development, Lee Ryan Soliman" },
    { name: "author", content: "Lee Ryan Soliman" },
    { name: "robots", content: "index, follow" },
    
    // Open Graph / Facebook
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Chug Blogs - Tech, Science, Life & Meta Thoughts" },
    { property: "og:description", content: "Personal blog by Lee Ryan Soliman featuring thoughts on technology, science, life, and meta topics." },
    { property: "og:url", content: "https://blog.leeryan.dev" },
    { property: "og:site_name", content: "Chug Blogs" },
    { property: "og:image", content: "https://blog.leeryan.dev/og-image.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: "en_US" },
    
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Chug Blogs - Tech, Science, Life & Meta Thoughts" },
    { name: "twitter:description", content: "Personal blog by Lee Ryan Soliman featuring thoughts on technology, science, life, and meta topics." },
    { name: "twitter:image", content: "https://blog.leeryan.dev/og-image.jpg" },
    { name: "twitter:creator", content: "@leeryansoliman" },
    
    // Additional SEO
    { name: "theme-color", content: "#dc2626" },
    { tagName: "link", rel: "canonical", href: "https://blog.leeryan.dev" },
  ];
};

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { getBlogPosts } = await import('~/lib/blog.client');
        const fetchedPosts = await getBlogPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="blog-list-container">
        <div className="blog-content">
          <div className="blog-main">
            <div className="blog-header">
              <h1>Chug Blogs</h1>
              <p>Loading posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      <div className="blog-content">
        <div className="blog-main">
          <div className="blog-header">
            <h1>Chug Blogs</h1>
            <p>Thoughts on tech, science, life, and everything in between</p>
          </div>

          <div className="blog-controls">
            <input
              type="text"
              placeholder="Search posts..."
              className="search-input"
            />
          </div>

          <div className="blog-posts">
            {posts.length > 0 ? (
              posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="no-posts">
                <h3>No posts found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>

        <BlogSidebar posts={posts} />
      </div>
    </div>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="blog-post-card">
      <div className="post-meta">
        <span className="post-category">{post.category}</span>
        <span className="post-date">{formatDate(post.publishDate)}</span>
        <span className="read-time">{post.readTime} min read</span>
      </div>
      
      <h2 className="post-title">{post.title}</h2>
      
      <p className="post-excerpt">{post.excerpt}</p>
      
      <div className="post-tags">
        {post.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>
      
      <Link to={`/post/${post.slug}`} className="read-more-btn">
        Read More →
      </Link>
    </article>
  );
}