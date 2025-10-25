import { useState } from 'react';
import { toast } from 'sonner';

interface BlogSettingsProps {
  onBack: () => void;
}

export default function BlogSettings({ onBack }: BlogSettingsProps) {
  const [settings, setSettings] = useState({
    blogTitle: 'Chug Blogs',
    blogDescription: 'Thoughts on tech, science, life, and everything in between',
    authorName: 'Lee Ryan Soliman',
    authorEmail: '2solimanleeryan@gmail.com',
    socialLinks: {
      twitter: '@leeryansoliman',
      github: '',
      linkedin: ''
    },
    postsPerPage: 10,
    enableComments: false,
    enableSearch: true
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Implement actual settings save
      console.log('Saving blog settings:', settings);
      
      // Simulate API call - TODO: Implement actual settings save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="blog-header">
        <h1>Blog Settings</h1>
        <p>Configure your blog preferences and information</p>
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
              <label htmlFor="authorEmail">Author Email</label>
              <input
                type="email"
                id="authorEmail"
                value={settings.authorEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, authorEmail: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="admin-card">
            <h3>Social Links</h3>
            
            <div className="form-group">
              <label htmlFor="twitter">Twitter Handle</label>
              <input
                type="text"
                id="twitter"
                value={settings.socialLinks.twitter}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                }))}
                placeholder="@username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="github">GitHub Username</label>
              <input
                type="text"
                id="github"
                value={settings.socialLinks.github}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, github: e.target.value }
                }))}
                placeholder="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn Profile</label>
              <input
                type="text"
                id="linkedin"
                value={settings.socialLinks.linkedin}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                }))}
                placeholder="linkedin.com/in/username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="postsPerPage">Posts Per Page</label>
              <input
                type="number"
                id="postsPerPage"
                value={settings.postsPerPage}
                onChange={(e) => setSettings(prev => ({ ...prev, postsPerPage: parseInt(e.target.value) || 10 }))}
                min="1"
                max="50"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.enableComments}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableComments: e.target.checked }))}
                />
                Enable Comments
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.enableSearch}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableSearch: e.target.checked }))}
                />
                Enable Search
              </label>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}