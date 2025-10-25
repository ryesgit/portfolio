import { Link } from "react-router-dom";
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
    <article className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
            {post.category}
          </span>
          <span className="text-gray-400 text-sm">
            {formatDate(post.publishDate)}
          </span>
        </div>
        <span className="text-gray-500 text-sm">{post.readTime} min read</span>
      </div>
      
      <Link to={`/post/${post.slug}`} className="group block">
        <h2 className="text-2xl font-bold mb-3 group-hover:text-red-400 transition-colors text-white">
          {post.title}
        </h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          {post.excerpt}
        </p>
      </Link>
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default BlogPostCard;