import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { type BlogPost } from '~/lib/blog.client';

interface EditPostProps {
  post: BlogPost;
  onBack: () => void;
  onPostUpdated: () => void;
}

export default function EditPost({ post, onBack, onPostUpdated }: EditPostProps) {
  const [formData, setFormData] = useState({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags,
    slug: post.slug,
    readTime: post.readTime,
    published: post.published || false,
    publishDate: post.publishDate
  });

  const [saving, setSaving] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { updateBlogPost } = await import('~/lib/blog.client');
      
      const updateData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };
      
      const success = await updateBlogPost(post.id, updateData);
      
      if (success) {
        toast.success('Post updated successfully!');
        onPostUpdated();
      } else {
        toast.error('Failed to update post. Please try again.');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Error updating post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="blog-header">
        <h1>Edit Post</h1>
        <p>Update your blog post content and settings</p>
      </div>

      <div className="admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg">
        <button onClick={onBack} className="admin-btn secondary">← Back to Manage Posts</button>
        <div className="form-actions-inline">
          <button type="button" onClick={onBack} className="admin-btn secondary">
            Cancel
          </button>
          <button 
            type="submit" 
            form="edit-post-form"
            disabled={saving} 
            className="admin-btn primary"
          >
            {saving ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <form id="edit-post-form" onSubmit={handleSubmit} className="admin-form-stack">
          <div className="admin-card">
            <h3>Post Content</h3>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="Enter post title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="post-url-slug"
              />
            </div>

            <div className="form-group">
              <label htmlFor="excerpt">Excerpt *</label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                required
                placeholder="Brief description of the post"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content *</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                required
                placeholder="Write your post content in Markdown"
                rows={25}
                style={{ minHeight: '500px' }}
              />
            </div>
          </div>

          <div className="admin-card">
            <h3>Post Settings</h3>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Technology, Science, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="React, JavaScript, Web Development"
              />
            </div>

            <div className="form-group">
              <label htmlFor="readTime">Read Time (minutes)</label>
              <input
                type="number"
                id="readTime"
                value={formData.readTime}
                onChange={(e) => setFormData(prev => ({ ...prev, readTime: parseInt(e.target.value) || 1 }))}
                min="1"
                max="60"
              />
            </div>

            <div className="form-group">
              <label htmlFor="publishDate">Publish Date</label>
              <input
                type="date"
                id="publishDate"
                value={formData.publishDate}
                onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                />
                Published
              </label>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}