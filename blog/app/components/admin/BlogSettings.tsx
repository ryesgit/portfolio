import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { type BlogMeta } from '~/lib/blog.client';

interface BlogSettingsProps {
  onBack: () => void;
}

export default function BlogSettings({ onBack }: BlogSettingsProps) {
  const [settings, setSettings] = useState<BlogMeta>({
    blogTitle: 'Chug Blogs',
    blogDescription: 'Thoughts on tech, science, life, and everything in between',
    blogKeywords: 'blog, tech, programming, development',
    authorName: 'Lee Ryan Soliman',
    siteUrl: 'https://blog.leeryan.dev',
    ogImage: 'https://blog.leeryan.dev/og-image.jpg',
    twitterHandle: '@leeryansoliman',
    googleAnalyticsId: '',
    favicon: '/favicon.ico',
    themeColor: '#dc2626'
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { getBlogMeta } = await import('~/lib/blog.client');
        const meta = await getBlogMeta();
        if (meta) {
          setSettings(meta);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Error loading settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { updateBlogMeta } = await import('~/lib/blog.client');
      const success = await updateBlogMeta(settings);
      
      if (success) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="blog-header">
          <h1>Blog Settings</h1>
          <p>Loading settings...</p>
        </div>
        <div className="admin-content">
          <div className="admin-card">
            <p>Loading blog settings...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="blog-header">
        <h1>Blog Settings</h1>
        <p>Configure your blog preferences and SEO information</p>
      </div>

      <div className="admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg">
        <button onClick={onBack} className="admin-btn secondary">← Back to Dashboard</button>
        <div className="form-actions-inline">
          <button type="button" onClick={onBack} className="admin-btn secondary">
            Cancel
          </button>
          <button 
            type="submit" 
            form="blog-settings-form"
            disabled={saving} 
            className="admin-btn primary"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <form id="blog-settings-form" onSubmit={handleSubmit} className="admin-form-grid">
          <div className="admin-card">
            <h3>General Settings</h3>
            
            <div className="form-group">
              <label htmlFor="blogTitle">Blog Title</label>
              <input
                type="text"
                id="blogTitle"
                value={settings.blogTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, blogTitle: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="blogDescription">Blog Description</label>
              <textarea
                id="blogDescription"
                value={settings.blogDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, blogDescription: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="blogKeywords">Keywords (comma-separated)</label>
              <input
                type="text"
                id="blogKeywords"
                value={settings.blogKeywords}
                onChange={(e) => setSettings(prev => ({ ...prev, blogKeywords: e.target.value }))}
                placeholder="blog, tech, programming, development"
              />
            </div>

            <div className="form-group">
              <label htmlFor="authorName">Author Name</label>
              <input
                type="text"
                id="authorName"
                value={settings.authorName}
                onChange={(e) => setSettings(prev => ({ ...prev, authorName: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="siteUrl">Site URL</label>
              <input
                type="url"
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                required
                placeholder="https://blog.example.com"
              />
            </div>
          </div>

          <div className="admin-card">
            <h3>SEO & Social Media</h3>
            
            <div className="form-group">
              <label htmlFor="ogImage">Open Graph Image URL</label>
              <input
                type="url"
                id="ogImage"
                value={settings.ogImage}
                onChange={(e) => setSettings(prev => ({ ...prev, ogImage: e.target.value }))}
                placeholder="https://blog.example.com/og-image.jpg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="twitterHandle">Twitter Handle</label>
              <input
                type="text"
                id="twitterHandle"
                value={settings.twitterHandle}
                onChange={(e) => setSettings(prev => ({ ...prev, twitterHandle: e.target.value }))}
                placeholder="@username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="googleAnalyticsId">Google Analytics ID</label>
              <input
                type="text"
                id="googleAnalyticsId"
                value={settings.googleAnalyticsId}
                onChange={(e) => setSettings(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            <div className="form-group">
              <label htmlFor="favicon">Favicon URL</label>
              <input
                type="text"
                id="favicon"
                value={settings.favicon}
                onChange={(e) => setSettings(prev => ({ ...prev, favicon: e.target.value }))}
                placeholder="/favicon.ico"
              />
            </div>

            <div className="form-group">
              <label htmlFor="themeColor">Theme Color (hex)</label>
              <input
                type="color"
                id="themeColor"
                value={settings.themeColor}
                onChange={(e) => setSettings(prev => ({ ...prev, themeColor: e.target.value }))}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}