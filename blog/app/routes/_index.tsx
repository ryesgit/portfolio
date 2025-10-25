import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import BlogSidebar from "~/components/BlogSidebar";
import type { BlogPost, BlogMeta } from "~/lib/blog.client";
import { getBlogMetaServer } from "~/lib/blog.server";
import "~/styles/blog.css";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const meta = data?.meta || {
    blogTitle: 'Chug Blogs',
    blogDescription: 'A modern blog powered by React Router and Firebase',
    blogKeywords: 'blog, tech, programming, development',
    authorName: 'Lee Ryan Soliman',
    siteUrl: 'https://blog.leeryan.dev',
    ogImage: 'https://blog.leeryan.dev/og-image.jpg',
    twitterHandle: '@leeryansoliman',
    themeColor: '#dc2626'
  };

  return [
    { title: meta.blogTitle },
    { name: "description", content: meta.blogDescription },
    { name: "keywords", content: meta.blogKeywords },
    { name: "author", content: meta.authorName },
    { name: "robots", content: "index, follow" },
    
    // Open Graph / Facebook
    { property: "og:type", content: "website" },
    { property: "og:title", content: meta.blogTitle },
    { property: "og:description", content: meta.blogDescription },
    { property: "og:url", content: meta.siteUrl },
    { property: "og:site_name", content: meta.blogTitle },
    { property: "og:image", content: meta.ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: "en_US" },
    
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: meta.blogTitle },
    { name: "twitter:description", content: meta.blogDescription },
    { name: "twitter:image", content: meta.ogImage },
    { name: "twitter:creator", content: meta.twitterHandle },
    
    // Additional SEO
    { name: "theme-color", content: meta.themeColor },
    { tagName: "link", rel: "canonical", href: meta.siteUrl },
  ];
};

export async function loader() {
  const meta = await getBlogMetaServer();
  return { meta };
}

export default function BlogIndex() {
  const { meta } = useLoaderData<typeof loader>();
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { getBlogPosts } = await import('~/lib/blog.client');
        const fetchedPosts = await getBlogPosts();
        setAllPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);

  // Filter posts when search term, category, or tag changes
  useEffect(() => {
    let filtered = allPosts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    setFilteredPosts(filtered);
  }, [allPosts, searchTerm, selectedCategory, selectedTag]);

  // Get unique categories and tags
  const categories = ['all', ...new Set(allPosts.map(post => post.category))];
  const tags = ['all', ...new Set(allPosts.flatMap(post => post.tags))];

  if (loading) {
    return (
      <div className="blog-list-container">
        <div className="blog-content">
          <div className="blog-main">
            <div className="blog-header">
              <h1>{meta?.blogTitle || 'Chug Blogs'}</h1>
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
            <h1>{meta?.blogTitle || 'Chug Blogs'}</h1>
            <p>{meta?.blogDescription || 'Thoughts on tech, science, life, and everything in between'}</p>
          </div>

          <div className="blog-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <div className="filter-group">
                <label htmlFor="category-filter">Category:</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="tag-filter">Tag:</label>
                <select
                  id="tag-filter"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="filter-select"
                >
                  {tags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag === 'all' ? 'All Tags' : tag}
                    </option>
                  ))}
                </select>
              </div>

              {(searchTerm || selectedCategory !== 'all' || selectedTag !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedTag('all');
                  }}
                  className="clear-filters-btn"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="blog-stats">
            <p>{filteredPosts.length} of {allPosts.length} posts</p>
          </div>

          <div className="blog-posts">
            {filteredPosts.length > 0 ? (
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

        <BlogSidebar posts={allPosts} />
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