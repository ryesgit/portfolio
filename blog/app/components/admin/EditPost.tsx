import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { type BlogPost } from '~/lib/blog.client';
import { uploadBlogImage, generateImageMarkdown } from '~/lib/imageUpload.client';
import 'katex/dist/katex.min.css';

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
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = formData.content;
    const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadBlogImage(file);
      if (result) {
        const markdown = generateImageMarkdown(result.url, file.name.split('.')[0]);
        insertTextAtCursor(markdown);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          handleImageUpload(file);
        }
        break;
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      } else {
        toast.error('Please drop an image file');
      }
    }
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
              <div className="content-editor-header">
                <label htmlFor="content">Content *</label>
                <div className="editor-controls">
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
                  <div className="image-upload-controls">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="upload-btn"
                      title="Upload image"
                    >
                      {uploading ? '⏳' : '📷'} {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                </div>
              </div>
              
              {!previewMode ? (
                <div className="textarea-container">
                  <textarea
                    ref={textareaRef}
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    onPaste={handlePaste}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    required
                    placeholder="Write your post content in Markdown\n\nTip: You can paste images directly or drag & drop them here!"
                    rows={25}
                    style={{ minHeight: '500px' }}
                    className={uploading ? 'uploading' : ''}
                  />
                  {uploading && (
                    <div className="upload-overlay">
                      <div className="upload-spinner">⏳ Uploading image...</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="markdown-preview" style={{ minHeight: '500px' }}>
                  {formData.content ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
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