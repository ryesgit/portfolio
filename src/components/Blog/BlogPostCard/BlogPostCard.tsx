import { BlogPost } from "../../../data/blogPosts";
import "./BlogPostCard.css";

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
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
      
      <button className="read-more-btn">
        Read More →
      </button>
    </article>
  );
};

export default BlogPostCard;