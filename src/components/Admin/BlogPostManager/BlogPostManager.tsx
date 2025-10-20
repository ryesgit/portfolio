import { useEffect, useState } from 'react';
import { BlogPost } from '../../../data/blogPosts';
import { getAllBlogPosts, deleteBlogPost, togglePublishStatus } from '../../../services/blogService';
import BlogPostEditor from '../BlogPostEditor/BlogPostEditor';
import './BlogPostManager.css';

interface BlogPostManagerProps {
  onPostsChange?: () => void;
}

const BlogPostManager = ({ onPostsChange }: BlogPostManagerProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getAllBlogPosts();
      setPosts(fetchedPosts);
      onPostsChange?.();
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreateNew = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  const handlePostSaved = () => {
    setShowEditor(false);
    setEditingPost(null);
    fetchPosts();
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setProcessingIds(prev => new Set(prev).add(postId));
    try {
      await deleteBlogPost(postId);
      fetchPosts();
    } catch (err) {
      setError('Failed to delete post');
      console.error('Error deleting post:', err);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleTogglePublish = async (postId: string, currentStatus: boolean | undefined) => {
    setProcessingIds(prev => new Set(prev).add(postId));
    try {
      await togglePublishStatus(postId, !currentStatus);
      fetchPosts();
    } catch (err) {
      setError('Failed to update publish status');
      console.error('Error toggling publish status:', err);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showEditor) {
    return (
      <BlogPostEditor
        post={editingPost}
        onSave={handlePostSaved}
        onCancel={handleCloseEditor}
      />
    );
  }

  return (
    <div className="blog-post-manager">
      <div className="manager-header">
        <h2>Blog Posts</h2>
        <button onClick={handleCreateNew} className="create-button">
          Create New Post
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : (
        <div className="posts-list">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No blog posts found.</p>
              <button onClick={handleCreateNew} className="create-button">
                Create your first post
              </button>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-meta">
                    <span className={`status ${post.published ? 'published' : 'draft'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="date">{formatDate(post.publishDate)}</span>
                  </div>
                  
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  
                  <div className="post-details">
                    <span className="category">{post.category}</span>
                    <span className="read-time">{post.readTime} min read</span>
                  </div>
                  
                  <div className="post-tags">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="tag-more">+{post.tags.length - 3}</span>
                    )}
                  </div>
                  
                  <div className="post-actions">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="action-button edit"
                      disabled={processingIds.has(post.id)}
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleTogglePublish(post.id, post.published)}
                      className={`action-button ${post.published ? 'unpublish' : 'publish'}`}
                      disabled={processingIds.has(post.id)}
                    >
                      {processingIds.has(post.id) 
                        ? '...' 
                        : post.published ? 'Unpublish' : 'Publish'
                      }
                    </button>
                    
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="action-button delete"
                      disabled={processingIds.has(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPostManager;