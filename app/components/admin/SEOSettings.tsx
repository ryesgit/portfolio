import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { type BlogMeta } from '~/lib/blog.client';

interface SEOSettingsProps {
  onBack: () => void;
}

export default function SEOSettings({ onBack }: SEOSettingsProps) {
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
        console.error('Error loading SEO settings:', error);
        toast.error('Error loading SEO settings');
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
        toast.success('SEO settings saved successfully!');
      } else {
        toast.error('Failed to save SEO settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast.error('Error saving SEO settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="blog-header">
          <h1>SEO Settings</h1>
          <p>Loading SEO settings...</p>
        </div>
        <div className="admin-content">
          <div className="admin-card">
            <p>Loading SEO settings...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="blog-header">
        <h1>SEO Settings</h1>
        <p>Optimize your blog for search engines and social media</p>
      </div>

      <div className="admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg">
        <button onClick={onBack} className="admin-btn secondary">← Back to Dashboard</button>
        <div className="form-actions-inline">
          <button type="button" onClick={onBack} className="admin-btn secondary">
            Cancel
          </button>
          <button 
            type="submit" 
            form="seo-settings-form"
            disabled={saving} 
            className="admin-btn primary"
          >
            {saving ? 'Saving...' : 'Save SEO Settings'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <form id="seo-settings-form" onSubmit={handleSubmit} className="admin-form-grid">
          <div className="admin-card">
            <h3>SEO Basics</h3>
          
            <div className="form-group">
              <label htmlFor="blogTitle">Blog Title</label>
              <input
                type="text"
                id="blogTitle"
                value={settings.blogTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, blogTitle: e.target.value }))}
                required
              />
              <small>This appears in search results and browser tabs</small>
            </div>

            <div className="form-group">
              <label htmlFor="blogDescription">Blog Description</label>
              <textarea
                id="blogDescription"
                value={settings.blogDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, blogDescription: e.target.value }))}
                rows={3}
                required
              />
              <small>Meta description for search engines (150-160 characters recommended)</small>
            </div>

            <div className="form-group">
              <label htmlFor="blogKeywords">Keywords</label>
              <input
                type="text"
                id="blogKeywords"
                value={settings.blogKeywords}
                onChange={(e) => setSettings(prev => ({ ...prev, blogKeywords: e.target.value }))}
                placeholder="keyword1, keyword2, keyword3"
              />
              <small>Comma-separated keywords related to your content</small>
            </div>

            <div className="form-group">
              <label htmlFor="siteUrl">Site URL</label>
              <input
                type="url"
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                required
              />
              <small>The main URL of your blog</small>
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
          </div>

          <div className="admin-card">
            <h3>Social Media & Open Graph</h3>
          
            <div className="form-group">
              <label htmlFor="ogImage">Open Graph Image URL</label>
              <input
                type="url"
                id="ogImage"
                value={settings.ogImage}
                onChange={(e) => setSettings(prev => ({ ...prev, ogImage: e.target.value }))}
              />
              <small>Image shown when your blog is shared on social media (1200x630px recommended)</small>
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
              <label htmlFor="themeColor">Theme Color</label>
              <input
                type="color"
                id="themeColor"
                value={settings.themeColor}
                onChange={(e) => setSettings(prev => ({ ...prev, themeColor: e.target.value }))}
              />
              <small>Color for mobile browser UI and app theming</small>
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
              <label htmlFor="googleAnalyticsId">Google Analytics ID</label>
              <input
                type="text"
                id="googleAnalyticsId"
                value={settings.googleAnalyticsId}
                onChange={(e) => setSettings(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
                placeholder="G-XXXXXXXXXX"
              />
              <small>Optional: For tracking website analytics</small>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}