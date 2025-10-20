import { categories, getAllTags } from "../../../data/blogPosts";
import "./BlogSidebar.css";

const BlogSidebar = () => {
  const tags = getAllTags();

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