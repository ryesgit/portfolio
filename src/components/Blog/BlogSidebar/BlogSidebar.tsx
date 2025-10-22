import { useEffect, useState } from "react";
import { getBlogPosts } from "../../../services/blogService";
import "./BlogSidebar.css";

interface BlogSidebarProps {
  categories?: string[];
  tags?: string[];
  selectedCategory?: string;
  selectedTag?: string;
  onCategoryChange?: (category: string) => void;
  onTagChange?: (tag: string) => void;
  onClearFilters?: () => void;
}

const BlogSidebar = ({
  categories: propCategories,
  tags: propTags,
  selectedCategory = "",
  selectedTag = "",
  onCategoryChange,
  onTagChange,
  onClearFilters,
}: BlogSidebarProps = {}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (!propCategories || !propTags) {
      const fetchData = async () => {
        const posts = await getBlogPosts();

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(posts.map((post) => post.category)),
        ].sort();
        setCategories(uniqueCategories);

        // Extract unique tags
        const allTags = posts.flatMap((post) => post.tags);
        const uniqueTags = [...new Set(allTags)].sort();
        setTags(uniqueTags);
      };

      fetchData();
    }
  }, [propCategories, propTags]);

  const displayCategories = propCategories || categories;
  const displayTags = propTags || tags;

  return (
    <aside className="blog-sidebar">
      <div className="sidebar-section">
        <h3>Categories</h3>
        <ul className="category-list">
          {onCategoryChange && (
            <li>
              <button
                onClick={() => onCategoryChange("")}
                className={selectedCategory === "" ? "active" : ""}
              >
                All Categories
              </button>
            </li>
          )}
          {displayCategories.map((category, index) => (
            <li key={index}>
              {onCategoryChange ? (
                <button
                  onClick={() => onCategoryChange(category)}
                  className={selectedCategory === category ? "active" : ""}
                >
                  {category}
                </button>
              ) : (
                <a
                  href={`#category-${category.toLowerCase().replace(" ", "-")}`}
                >
                  {category}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Tags</h3>
        <div className="tags-cloud">
          {displayTags.map((tag, index) =>
            onTagChange ? (
              <button
                key={index}
                className={`tag-cloud-item ${
                  selectedTag === tag ? "active" : ""
                }`}
                onClick={() => onTagChange(selectedTag === tag ? "" : tag)}
              >
                {tag}
              </button>
            ) : (
              <span key={index} className="tag-cloud-item">
                {tag}
              </span>
            )
          )}
        </div>
        {onClearFilters && (selectedCategory || selectedTag) && (
          <button onClick={onClearFilters} className="clear-filters">
            Clear Filters
          </button>
        )}
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
