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
      
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4">Chug Blogs</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Tech, Science, Life & Meta Thoughts
            </p>
            <p className="text-gray-400 mt-2">
              Personal insights from a software engineer's perspective
            </p>
          </header>

          {/* Search Controls */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none flex-1 min-w-64"
              />
              
              {/* Filters */}
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
                >
                  <option value="">All Tags</option>
                  {tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                
                {(selectedCategory || selectedTag || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedTag('');
                      setSearchQuery('');
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <main className="max-w-4xl mx-auto">
            {loading ? (
              <div className="space-y-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-24 mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-8">
                {filteredPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No posts found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </main>

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
};

export default BlogList;