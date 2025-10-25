import { useState } from 'react';
import { toast } from 'sonner';

interface SEOSettingsProps {
  onBack: () => void;
}

export default function SEOSettings({ onBack }: SEOSettingsProps) {
  const [seoSettings, setSeoSettings] = useState({
    siteTitle: 'Chug Blogs - Tech, Science, Life & Meta Thoughts',
    siteDescription: 'Personal blog by Lee Ryan Soliman featuring thoughts on technology, science, life, and meta topics. Explore insights from a software engineer\'s perspective.',
    siteKeywords: 'blog, technology, science, life, meta, software engineering, programming, web development, Lee Ryan Soliman',
    canonicalUrl: 'https://blog.leeryan.dev',
    ogImage: 'https://blog.leeryan.dev/og-image.jpg',
    twitterCard: 'summary_large_image',
    twitterCreator: '@leeryansoliman',
    themeColor: '#dc2626',
    enableSitemap: true,
    enableRobots: true,
    robotsContent: 'index, follow',
    googleAnalyticsId: '',
    googleSearchConsoleId: ''
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Implement actual SEO settings save
      console.log('Saving SEO settings:', seoSettings);
      
      // Simulate API call - TODO: Implement actual SEO settings save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('SEO settings saved successfully!');
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast.error('Error saving SEO settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
            <h3>Basic SEO</h3>
          
          <div className="form-group">
            <label htmlFor="siteTitle">Site Title</label>
            <input
              type="text"
              id="siteTitle"
              value={seoSettings.siteTitle}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
              required
            />
            <small>This appears in search results and browser tabs</small>
          </div>

          <div className="form-group">
            <label htmlFor="siteDescription">Site Description</label>
            <textarea
              id="siteDescription"
              value={seoSettings.siteDescription}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              rows={3}
              required
            />
            <small>Meta description for search engines (150-160 characters recommended)</small>
          </div>

          <div className="form-group">
            <label htmlFor="siteKeywords">Keywords</label>
            <input
              type="text"
              id="siteKeywords"
              value={seoSettings.siteKeywords}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, siteKeywords: e.target.value }))}
              placeholder="keyword1, keyword2, keyword3"
            />
            <small>Comma-separated keywords related to your content</small>
          </div>

          <div className="form-group">
            <label htmlFor="canonicalUrl">Canonical URL</label>
            <input
              type="url"
              id="canonicalUrl"
              value={seoSettings.canonicalUrl}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, canonicalUrl: e.target.value }))}
              required
            />
            <small>The main URL of your blog</small>
          </div>
          </div>

          <div className="admin-card">
            <h3>Social Media / Open Graph</h3>
          
          <div className="form-group">
            <label htmlFor="ogImage">Open Graph Image URL</label>
            <input
              type="url"
              id="ogImage"
              value={seoSettings.ogImage}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, ogImage: e.target.value }))}
            />
            <small>Image shown when your blog is shared on social media (1200x630px recommended)</small>
          </div>

          <div className="form-group">
            <label htmlFor="twitterCard">Twitter Card Type</label>
            <select
              id="twitterCard"
              value={seoSettings.twitterCard}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, twitterCard: e.target.value }))}
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary with Large Image</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="twitterCreator">Twitter Creator Handle</label>
            <input
              type="text"
              id="twitterCreator"
              value={seoSettings.twitterCreator}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, twitterCreator: e.target.value }))}
              placeholder="@username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="themeColor">Theme Color</label>
            <input
              type="color"
              id="themeColor"
              value={seoSettings.themeColor}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, themeColor: e.target.value }))}
            />
            <small>Color for mobile browser UI</small>
          </div>
        </div>

        <div className="settings-section">
          <h3>Search Engine Settings</h3>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={seoSettings.enableSitemap}
                onChange={(e) => setSeoSettings(prev => ({ ...prev, enableSitemap: e.target.checked }))}
              />
              Generate XML Sitemap
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={seoSettings.enableRobots}
                onChange={(e) => setSeoSettings(prev => ({ ...prev, enableRobots: e.target.checked }))}
              />
              Generate Robots.txt
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="robotsContent">Robots.txt Content</label>
            <input
              type="text"
              id="robotsContent"
              value={seoSettings.robotsContent}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, robotsContent: e.target.value }))}
              placeholder="index, follow"
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Analytics</h3>
          
          <div className="form-group">
            <label htmlFor="googleAnalyticsId">Google Analytics ID</label>
            <input
              type="text"
              id="googleAnalyticsId"
              value={seoSettings.googleAnalyticsId}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
              placeholder="GA_MEASUREMENT_ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="googleSearchConsoleId">Google Search Console ID</label>
            <input
              type="text"
              id="googleSearchConsoleId"
              value={seoSettings.googleSearchConsoleId}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, googleSearchConsoleId: e.target.value }))}
              placeholder="google-site-verification content"
            />
          </div>
          </div>
        </form>
      </div>
    </>
  );
}