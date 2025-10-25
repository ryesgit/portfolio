import { useState } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { type BlogPost } from '~/lib/blog.client';

interface CreatePostProps {
  onBack: () => void;
  onPostCreated: () => void;
}

export default function CreatePost({ onBack, onPostCreated }: CreatePostProps) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    slug: '',
    readTime: 1,
    published: false
  });

  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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
      const { createBlogPost } = await import('~/lib/blog.client');
      
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };
      
      const postId = await createBlogPost(postData);
      
      if (postId) {
        toast.success('Post created successfully!');
        onPostCreated();
      } else {
        toast.error('Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error creating post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="blog-header">
        <h1>Create New Post</h1>
        <p>Write and publish a new blog post</p>
      </div>

      <div className="admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg">
        <button onClick={onBack} className="admin-btn secondary">← Back to Dashboard</button>
        <div className="form-actions-inline">
          <button type="button" onClick={onBack} className="admin-btn secondary">
            Cancel
          </button>
          <button 
            type="submit" 
            form="create-post-form"
            disabled={saving} 
            className="admin-btn primary"
          >
            {saving ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <form id="create-post-form" onSubmit={handleSubmit} className="admin-form-stack">
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
              <div className="content-editor-header">
                <label htmlFor="content">Content *</label>
                <div className="preview-tabs">
                  <button
                    type="button"
                    className={`tab-btn ${!previewMode ? 'active' : ''}`}
                    onClick={() => setPreviewMode(false)}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${previewMode ? 'active' : ''}`}
                    onClick={() => setPreviewMode(true)}
                  >
                    Preview
                  </button>
                </div>
              </div>
              
              {!previewMode ? (
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                  placeholder="Write your post content in Markdown"
                  rows={25}
                  style={{ minHeight: '500px' }}
                />
              ) : (
                <div className="markdown-preview" style={{ minHeight: '500px' }}>
                  {formData.content ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      components={{
                        pre: ({ children, ...props }) => (
                          <pre className="code-block" {...props}>
                            {children}
                          </pre>
                        ),
                        code: ({ inline, children, ...props }) => 
                          inline ? (
                            <code className="inline-code" {...props}>
                              {children}
                            </code>
                          ) : (
                            <code {...props}>{children}</code>
                          ),
                        blockquote: ({ children, ...props }) => (
                          <blockquote className="quote" {...props}>
                            {children}
                          </blockquote>
                        ),
                        h1: ({ children, ...props }) => (
                          <h1 className="content-h1" {...props}>
                            {children}
                          </h1>
                        ),
                        h2: ({ children, ...props }) => (
                          <h2 className="content-h2" {...props}>
                            {children}
                          </h2>
                        ),
                        h3: ({ children, ...props }) => (
                          <h3 className="content-h3" {...props}>
                            {children}
                          </h3>
                        ),
                        a: ({ children, href, ...props }) => (
                          <a 
                            href={href}
                            className="content-link"
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            {...props}
                          >
                            {children}
                          </a>
                        ),
                        ul: ({ children, ...props }) => (
                          <ul className="content-list" {...props}>
                            {children}
                          </ul>
                        ),
                        ol: ({ children, ...props }) => (
                          <ol className="content-list ordered" {...props}>
                            {children}
                          </ol>
                        ),
                        p: ({ children, ...props }) => (
                          <p className="content-paragraph" {...props}>
                            {children}
                          </p>
                        ),
                      }}
                    >
                      {formData.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="preview-placeholder">Nothing to preview. Start writing in the Write tab to see your content rendered here.</p>
                  )}
                </div>
              )}
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
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                />
                Publish immediately
              </label>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}