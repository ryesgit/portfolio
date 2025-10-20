import { useEffect, useState } from "react";
import { getBlogPosts } from "../../../services/blogService";
import "./BlogSidebar.css";

const BlogSidebar = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const posts = await getBlogPosts();
      
      // Extract unique categories
      const uniqueCategories = [...new Set(posts.map(post => post.category))].sort();
      setCategories(uniqueCategories);
      
      // Extract unique tags
      const allTags = posts.flatMap(post => post.tags);
      const uniqueTags = [...new Set(allTags)].sort();
      setTags(uniqueTags);
    };

    fetchData();
  }, []);

  return (
    <aside className="blog-sidebar">
      <div className="sidebar-section">
        <h3>Categories</h3>
        <ul className="category-list">
          {categories.map((category, index) => (
            <li key={index}>
              <a href={`#category-${category.toLowerCase().replace(' ', '-')}`}>
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
          Computer Engineering student sharing insights on technology, 
          development, and problem-solving. Welcome to my digital space 
          where I document my learning journey.
        </p>
      </div>
    </aside>
  );
};

export default BlogSidebar;