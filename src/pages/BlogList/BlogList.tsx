import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPost } from '../../data/blogPosts';
import { getBlogPosts } from '../../services/blogService';
import BlogPostCard from '../../components/Blog/BlogPostCard/BlogPostCard';
import BlogSidebar from '../../components/Blog/BlogSidebar/BlogSidebar';
import BlogPostSkeleton from '../../components/ui/SkeletonLoader/BlogPostSkeleton';
import './BlogList.css';

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const blogPosts = await getBlogPosts();
        setPosts(blogPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesTag && matchesSearch;
  });

  const categories = Array.from(new Set(posts.map(post => post.category))).filter(Boolean);
  const tags = Array.from(new Set(posts.flatMap(post => post.tags))).filter(Boolean);

  if (error) {
    return (
      <div className="blog-list-container">
        <div className="error-message">
          <h2>Error Loading Posts</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Chug Blogs - Tech, Science, Life & Meta Thoughts</title>
        <meta name="description" content="Personal blog by Lee Ryan Soliman featuring thoughts on technology, science, life, and meta topics. Explore insights from a software engineer's perspective." />
        <meta name="keywords" content="blog, technology, science, life, meta, software engineering, programming, web development, Lee Ryan Soliman" />
        <meta name="author" content="Lee Ryan Soliman" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Chug Blogs - Tech, Science, Life & Meta Thoughts" />
        <meta property="og:description" content="Personal blog by Lee Ryan Soliman featuring thoughts on technology, science, life, and meta topics." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blog.leeryan.dev" />
        <meta property="og:site_name" content="Chug Blogs" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chug Blogs - Tech, Science, Life & Meta Thoughts" />
        <meta name="twitter:description" content="Personal blog by Lee Ryan Soliman featuring thoughts on technology, science, life, and meta topics." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://blog.leeryan.dev" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Chug Blogs",
            "description": "Personal blog by Lee Ryan Soliman featuring thoughts on technology, science, life, and meta topics.",
            "url": "https://blog.leeryan.dev",
            "author": {
              "@type": "Person",
              "name": "Lee Ryan Soliman"
            },
            "publisher": {
              "@type": "Person",
              "name": "Lee Ryan Soliman"
            },
            "blogPost": posts.slice(0, 10).map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "url": `https://blog.leeryan.dev/post/${post.slug}`,
              "datePublished": post.publishDate,
              "author": {
                "@type": "Person",
                "name": "Lee Ryan Soliman"
              }
            }))
          })}
        </script>
      </Helmet>
      
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="blog-posts">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <BlogPostSkeleton key={index} />
              ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
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

        <BlogSidebar
          categories={categories}
          tags={tags}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          onCategoryChange={setSelectedCategory}
          onTagChange={setSelectedTag}
          onClearFilters={() => {
            setSelectedCategory('');
            setSelectedTag('');
            setSearchQuery('');
          }}
        />
      </div>
    </div>
    </>
  );
};

export default BlogList;