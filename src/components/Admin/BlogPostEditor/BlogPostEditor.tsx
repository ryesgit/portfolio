import { useState, useEffect } from 'react';
import { BlogPost } from '../../../data/blogPosts';
import { createBlogPost, updateBlogPost } from '../../../services/blogService';
import './BlogPostEditor.css';

interface BlogPostEditorProps {
  post?: BlogPost | null;
  onSave: () => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  slug: string;
  readTime: number;
  publishDate: string;
}

const BlogPostEditor = ({ post, onSave, onCancel }: BlogPostEditorProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    slug: '',
    readTime: 5,
    publishDate: new Date().toISOString().split('T')[0]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<Record<string, string>>({});

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags.join(', '),
        slug: post.slug,
        readTime: post.readTime,
        publishDate: post.publishDate
      });
    }
  }, [post]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title' && !post) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }

    // Auto-estimate read time from content
    if (name === 'content') {
      setFormData(prev => ({
        ...prev,
        readTime: estimateReadTime(value)
      }));
    }

    // Clear validation error for this field
    if (validation[name]) {
      setValidation(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.excerpt.trim()) {
      errors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length > 300) {
      errors.excerpt = 'Excerpt must be less than 300 characters';
    }

    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }

    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }

    if (!formData.tags.trim()) {
      errors.tags = 'At least one tag is required';
    }

    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    if (formData.readTime < 1) {
      errors.readTime = 'Read time must be at least 1 minute';
    }

    if (!formData.publishDate) {
      errors.publishDate = 'Publish date is required';
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const postData: Omit<BlogPost, 'id'> = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        category: formData.category.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        slug: formData.slug.trim(),
        readTime: formData.readTime,
        publishDate: formData.publishDate
      };

      if (post) {
        await updateBlogPost(post.id, postData);
      } else {
        await createBlogPost(postData);
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const predefinedCategories = [
    'Development',
    'Best Practices',
    'AI & Technology', 
    'Performance',
    'Personal',
    'Tutorial',
    'Review'
  ];

  return (
    <div className="blog-post-editor">
      <div className="editor-header">
        <h2>{post ? 'Edit Post' : 'Create New Post'}</h2>
        <div className="header-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="post-form"
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form id="post-form" onSubmit={handleSubmit} className="editor-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={validation.title ? 'error' : ''}
              placeholder="Enter post title"
              disabled={loading}
            />
            {validation.title && <span className="validation-error">{validation.title}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="excerpt">Excerpt *</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className={validation.excerpt ? 'error' : ''}
              placeholder="Brief description of the post"
              rows={3}
              disabled={loading}
            />
            <div className="char-count">
              {formData.excerpt.length}/300 characters
            </div>
            {validation.excerpt && <span className="validation-error">{validation.excerpt}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={validation.content ? 'error' : ''}
              placeholder="Write your post content here..."
              rows={15}
              disabled={loading}
            />
            {validation.content && <span className="validation-error">{validation.content}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={validation.category ? 'error' : ''}
              disabled={loading}
            >
              <option value="">Select a category</option>
              {predefinedCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {validation.category && <span className="validation-error">{validation.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags *</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className={validation.tags ? 'error' : ''}
              placeholder="tag1, tag2, tag3"
              disabled={loading}
            />
            {validation.tags && <span className="validation-error">{validation.tags}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="slug">Slug *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className={validation.slug ? 'error' : ''}
              placeholder="post-url-slug"
              disabled={loading}
            />
            {validation.slug && <span className="validation-error">{validation.slug}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="readTime">Read Time (minutes) *</label>
            <input
              type="number"
              id="readTime"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              className={validation.readTime ? 'error' : ''}
              min="1"
              disabled={loading}
            />
            {validation.readTime && <span className="validation-error">{validation.readTime}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="publishDate">Publish Date *</label>
            <input
              type="date"
              id="publishDate"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
              className={validation.publishDate ? 'error' : ''}
              disabled={loading}
            />
            {validation.publishDate && <span className="validation-error">{validation.publishDate}</span>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogPostEditor;