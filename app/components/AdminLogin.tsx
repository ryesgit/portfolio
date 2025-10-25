import { useState } from 'react';
import { signInWithGoogle } from '../lib/auth.client';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      
      const user = await signInWithGoogle();
      
      if (user) {
        onLoginSuccess();
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-card">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        
        <div className="login-content">
          <p className="text-gray-300 mb-6 text-center">
            Please sign in with your authorized Google account to access the admin panel.
          </p>

          {error && (
            <div className="error-message bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="google-signin-btn w-full bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="admin-info mt-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400 text-center">
              <strong>Admin Access Only:</strong> This login is restricted to authorized administrators only. 
              If you're not an admin, you won't be able to access this panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}