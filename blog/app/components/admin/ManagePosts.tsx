import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { type BlogPost } from '~/lib/blog.client';

interface ManagePostsProps {
  onBack: () => void;
  onEditPost?: (post: BlogPost) => void;
}

export default function ManagePosts({ onBack, onEditPost }: ManagePostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    // Add a small delay to ensure Firebase is properly initialized
    const timer = setTimeout(() => {
      loadPosts();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const loadPosts = async () => {
    try {
      // Try to get all posts first (for admin), fallback to published only
      const { getAllBlogPosts, getBlogPosts } = await import('~/lib/blog.client');
      
      try {
        // First try to get all posts (requires admin permissions)
        const allPosts = await getAllBlogPosts();
        setPosts(allPosts);
      } catch (adminError) {
        console.log('Admin access not available, loading published posts only:', adminError);
        // Fallback to published posts only if admin access fails
        const publishedPosts = await getBlogPosts();
        setPosts(publishedPosts);
      }
    } catch (error) {
      console.error('Error loading posts in ManagePosts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const { deleteBlogPost } = await import('~/lib/blog.client');
      await deleteBlogPost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error deleting post. Please try again.');
    }
  };

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      const { togglePublishStatus } = await import('~/lib/blog.client');
      await togglePublishStatus(postId, !currentStatus);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, published: !currentStatus }
          : post
      ));
      toast.success(`Post ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Error updating post status. Please try again.');
    }
  };

  const handleEditPost = (post: BlogPost) => {
    if (onEditPost) {
      onEditPost(post);
    } else {
      toast.info('Edit functionality coming soon!');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'published') return post.published;
    if (filter === 'draft') return !post.published;
    return true;
  });

  if (loading) {
    return (
      <>
        <div className="blog-header">
          <h1>Manage Posts</h1>
          <p>Loading posts...</p>
        </div>
        <div className="admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg">
          <button onClick={onBack} className="admin-btn secondary">← Back to Dashboard</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="blog-header">
        <h1>Manage Posts</h1>
        <p>Edit, publish, and manage your blog posts</p>
      </div>

      <div className="admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg">
        <button onClick={onBack} className="admin-btn secondary">← Back to Dashboard</button>
        <div className="posts-filter">
          <button 
            className={`admin-btn ${filter === 'all' ? 'primary' : 'secondary'}`}
            onClick={() => setFilter('all')}
          >
            All ({posts.length})
          </button>
          <button 
            className={`admin-btn ${filter === 'published' ? 'primary' : 'secondary'}`}
            onClick={() => setFilter('published')}
          >
            Published ({posts.filter(p => p.published).length})
          </button>
          <button 
            className={`admin-btn ${filter === 'draft' ? 'primary' : 'secondary'}`}
            onClick={() => setFilter('draft')}
          >
            Drafts ({posts.filter(p => !p.published).length})
          </button>
        </div>
      </div>

      <div className="admin-content">
        {filteredPosts.length === 0 ? (
          <div className="admin-card">
            <h3>No posts found</h3>
            <p>No posts match the current filter criteria.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="admin-card">
              <div className="post-card-header">
                <h3>{post.title}</h3>
                <span className={`status ${post.published ? 'published' : 'draft'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
              
              <div className="post-meta">
                {post.category} • {post.publishDate} • {post.readTime} min read
              </div>
              
              <p className="post-excerpt">{post.excerpt}</p>
              
              <div className="admin-actions">
                <button 
                  className="admin-btn secondary"
                  onClick={() => handleEditPost(post)}
                >
                  Edit
                </button>
                <button 
                  className={`admin-btn ${post.published ? 'secondary' : 'primary'}`}
                  onClick={() => handleTogglePublish(post.id, post.published || false)}
                >
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button 
                  className="admin-btn danger"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}