import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { BlogDarkModeProvider } from './contexts/BlogDarkModeProvider';
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
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Loading...</h1>
          <p className="text-gray-300">Please wait while we load the blog</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <BlogDarkModeProvider>
        <AuthProvider>
          <Helmet titleTemplate="%s" defaultTitle="Chug Blogs - Tech, Science, Life & Meta">
            <meta name="application-name" content="Chug Blogs" />
            <meta name="apple-mobile-web-app-title" content="Chug Blogs" />
          </Helmet>
          <Router>
            <Routes>
              <Route path="/" element={<BlogList />} />
              <Route path="/post/:slug" element={<BlogPost />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={
                <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
                    <p className="text-gray-300">Page not found</p>
                  </div>
                </div>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </BlogDarkModeProvider>
    </HelmetProvider>
  );
}

export default BlogApp;