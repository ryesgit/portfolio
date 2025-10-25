import type { MetaFunction } from "react-router";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Toaster } from "sonner";
import AdminLogin from "~/components/AdminLogin";
import CreatePost from "~/components/admin/CreatePost";
import EditPost from "~/components/admin/EditPost";
import ManagePosts from "~/components/admin/ManagePosts";
import BlogSettings from "~/components/admin/BlogSettings";
import SEOSettings from "~/components/admin/SEOSettings";
import { type AuthUser, onAuthStateChange, signOutAdmin } from "~/lib/auth.client";
import "~/styles/blog.css";
import "~/styles/admin.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin - Chug Blogs" },
    { name: "description", content: "Admin panel for managing Chug Blogs" },
    { name: "robots", content: "noindex, nofollow" },
  ];
};

type AdminView = 'dashboard' | 'create-post' | 'edit-post' | 'manage-posts' | 'blog-settings' | 'seo-settings';

export default function Admin() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editingPost, setEditingPost] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    // User state will be updated by the auth state listener
  };

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleCreatePost = () => {
    setCurrentView('create-post');
  };

  const handleManagePosts = () => {
    setCurrentView('manage-posts');
  };

  const handleBlogSettings = () => {
    setCurrentView('blog-settings');
  };

  const handleSeoSettings = () => {
    setCurrentView('seo-settings');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setEditingPost(null);
  };

  const handleBackToManagePosts = () => {
    setCurrentView('manage-posts');
    setEditingPost(null);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setCurrentView('edit-post');
  };

  if (loading) {
    return (
      <div className="blog-list-container">
        <div className="blog-content">
          <div className="blog-main">
            <div className="blog-header">
              <h1>Loading...</h1>
              <p>Please wait while we load the admin panel</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      <div className="blog-content">
        <div className="blog-main">
          <nav className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-red-400 hover:text-red-500 transition-colors"
            >
              ← Back to Blog
            </Link>
          </nav>

          {!user?.isAdmin ? (
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
          ) : (
            <>
              {currentView === 'dashboard' && (
                <>
                  <div className="blog-header">
                    <h1>Admin Panel</h1>
                    <p>Manage your blog posts and content</p>
                  </div>

                  <div className="admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                    <span className="text-gray-300">Welcome, {user.email}</span>
                    <button onClick={handleSignOut} className="admin-btn secondary">
                      Sign Out
                    </button>
                  </div>

                  <div className="admin-content">
                    <div className="admin-card">
                      <h2>Blog Management</h2>
                      <p>Create, edit, and manage your blog posts.</p>
                      <div className="admin-actions">
                        <button onClick={handleCreatePost} className="admin-btn primary">Create New Post</button>
                        <button onClick={handleManagePosts} className="admin-btn secondary">Manage Posts</button>
                      </div>
                    </div>

                    <div className="admin-card">
                      <h2>Settings</h2>
                      <p>Configure blog settings and preferences.</p>
                      <div className="admin-actions">
                        <button onClick={handleBlogSettings} className="admin-btn secondary">Blog Settings</button>
                        <button onClick={handleSeoSettings} className="admin-btn secondary">SEO Settings</button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {currentView === 'create-post' && (
                <CreatePost 
                  onBack={handleBackToDashboard}
                  onPostCreated={handleBackToDashboard}
                />
              )}

              {currentView === 'manage-posts' && (
                <ManagePosts 
                  onBack={handleBackToDashboard} 
                  onEditPost={handleEditPost}
                />
              )}

              {currentView === 'edit-post' && editingPost && (
                <EditPost 
                  post={editingPost}
                  onBack={handleBackToManagePosts}
                  onPostUpdated={handleBackToManagePosts}
                />
              )}

              {currentView === 'blog-settings' && (
                <BlogSettings onBack={handleBackToDashboard} />
              )}

              {currentView === 'seo-settings' && (
                <SEOSettings onBack={handleBackToDashboard} />
              )}
            </>
          )}
        </div>

        <aside className="blog-sidebar">
          <div className="sidebar-section">
            <h3>Quick Actions</h3>
            <ul className="category-list">
              <li><a href="#new-post">New Post</a></li>
              <li><a href="#drafts">Drafts</a></li>
              <li><a href="#published">Published</a></li>
              <li><a href="#settings">Settings</a></li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Recent Activity</h3>
            <p>No recent activity to display.</p>
          </div>
        </aside>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}