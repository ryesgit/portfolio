import { useEffect, useState } from 'react';
import { useContext } from 'react';
import Container from '../../components/Container/index';
import BlogHeader from '../../components/Header/BlogHeader';
import Dashes from '../../components/ui/Dashes';
import AdminLogin from '../../components/Admin/AdminLogin/AdminLogin';
import BlogPostManager from '../../components/Admin/BlogPostManager/BlogPostManager';
import ChatBot from '../../components/AIChat/ChatBot';
import { AuthUser, onAuthStateChange, signOutAdmin } from '../../services/authService';
import BlogDarkModeContext from '../../contexts/BlogDarkModeProvider';
import './Admin.css';

function Admin() {
  const { dark } = useContext(BlogDarkModeContext);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className={`${dark ? "dark" : "light"}`}>
        <BlogHeader />
        <Container>
          <main id="main-content">
            <div className="admin-loading">Loading...</div>
          </main>
        </Container>
      </div>
    );
  }

  return (
    <>
      <div className={`${dark ? "dark" : "light"}`}>
        <BlogHeader />
        <Container>
          <main id="main-content">
            <Dashes color="indianred" />
            
            {!user?.isAdmin ? (
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            ) : (
              <div className="admin-dashboard">
                <div className="admin-header">
                  <h1>Blog Administration</h1>
                  <div className="admin-user-info">
                    <span>Welcome, {user.email}</span>
                    <button onClick={handleSignOut} className="sign-out-button">
                      Sign Out
                    </button>
                  </div>
                </div>
                
                <BlogPostManager />
              </div>
            )}
            
            <Dashes color="indianred" />
          </main>
          <aside>
            <footer style={{
              textAlign: "center",
              padding: "1rem 2rem",
            }}>
              © Soliman, {new Date().getFullYear()}
            </footer>
          </aside>
        </Container>
        <ChatBot />
      </div>
    </>
  );
}

export default Admin;