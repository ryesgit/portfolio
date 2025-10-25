interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  category: string;
  tags: string[];
  slug: string;
  readTime: number;
  published?: boolean;
}

interface BlogSidebarProps {
  posts: BlogPost[];
}

const BlogSidebar = ({ posts }: BlogSidebarProps) => {
  // Extract unique categories
  const categories = Array.from(new Set(posts.map(post => post.category))).filter(Boolean);
  
  // Extract unique tags
  const allTags = posts.flatMap(post => post.tags || []);
  const tags = Array.from(new Set(allTags));

  return (
    <aside className="blog-sidebar">
      <div className="sidebar-section">
        <h3>Categories</h3>
        <ul className="category-list">
          {categories.map((category, index) => (
            <li key={index}>
              <a href={`#category-${category.toLowerCase().replace(" ", "-")}`}>
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Tags</h3>
        <div className="tags-cloud">
          {tags.map((tag, index) => (
            <span key={index} className="tag-cloud-item">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3>About</h3>
        <p>
          I write some of my learnings, reflections, and whatever it may be
          here. <br />
          Some of them are coherent, hopefully.
        </p>
      </div>
    </aside>
  );
};

export default BlogSidebar;