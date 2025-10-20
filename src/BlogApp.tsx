import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './contexts/DarkModeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import BlogList from './pages/BlogList/BlogList';
import BlogPost from './pages/BlogPost/BlogPost';
import Admin from './pages/Admin/Admin';
import BlogHeader from './components/Blog/BlogHeader/BlogHeader';
import './App.css';

function BlogApp() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <div className="blog-app">
            <BlogHeader />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<BlogList />} />
                <Route path="/post/:slug" element={<BlogPost />} />
                <Route 
                  path="/admin/*" 
                  element={
                    user?.email === import.meta.env.VITE_ADMIN_EMAIL 
                      ? <Admin /> 
                      : <Navigate to="/" replace />
                  } 
                />
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default BlogApp;