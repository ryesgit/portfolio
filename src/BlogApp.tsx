import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { DarkModeProvider } from './contexts/DarkModeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import BlogList from './pages/BlogList/BlogList';
import BlogPost from './pages/BlogPost/BlogPost';
import Admin from './pages/Admin/Admin';
import './App.css';

function BlogApp() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });

    // Ensure dark mode is applied to document
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <HelmetProvider>
      <DarkModeProvider>
        <AuthProvider>
          <Helmet>
            <title>Chug Blogs</title>
          </Helmet>
          <Router>
            <div className="blog-app dark">
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<BlogList />} />
                  <Route path="/post/:slug" element={<BlogPost />} />
                  <Route path="/admin/*" element={<Admin />} />
                  <Route path="*" element={<div>Page not found</div>} />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </DarkModeProvider>
    </HelmetProvider>
  );
}

export default BlogApp;