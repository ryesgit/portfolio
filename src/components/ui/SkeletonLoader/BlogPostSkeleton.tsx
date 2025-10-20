import "./BlogPostSkeleton.css";

const BlogPostSkeleton = () => {
  return (
    <div className="blog-post-skeleton">
      <div className="skeleton-meta">
        <div className="skeleton-category"></div>
        <div className="skeleton-date"></div>
        <div className="skeleton-read-time"></div>
      </div>
      
      <div className="skeleton-title"></div>
      <div className="skeleton-title-short"></div>
      
      <div className="skeleton-excerpt">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line-short"></div>
      </div>
      
      <div className="skeleton-tags">
        <div className="skeleton-tag"></div>
        <div className="skeleton-tag"></div>
        <div className="skeleton-tag"></div>
      </div>
      
      <div className="skeleton-button"></div>
    </div>
  );
};

const BlogPostsSkeleton = () => {
  return (
    <>
      <BlogPostSkeleton />
      <BlogPostSkeleton />
      <BlogPostSkeleton />
    </>
  );
};

export default BlogPostsSkeleton;