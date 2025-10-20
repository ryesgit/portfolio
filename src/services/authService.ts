import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Admin email - only this user can write to the blog
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'your-admin-email@example.com';

export interface AuthUser {
  uid: string;
  email: string;
  isAdmin: boolean;
}

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.email === ADMIN_EMAIL;
};

// Convert Firebase User to AuthUser
export const convertToAuthUser = (user: User | null): AuthUser | null => {
  if (!user || !user.email) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    isAdmin: isAdmin(user)
  };
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<AuthUser | null> => {
  try {
    const provider = new GoogleAuthProvider();
    
    // Add additional scopes if needed
    provider.addScope('email');
    provider.addScope('profile');
    
    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const userCredential = await signInWithPopup(auth, provider);
    const authUser = convertToAuthUser(userCredential.user);
    
    if (!authUser?.isAdmin) {
      await signOut(auth); // Sign out if not admin
      throw new Error('Access denied: Admin privileges required. Please sign in with the authorized Google account.');
    }
    
    return authUser;
  } catch (error: any) {
    console.error('Google sign in error:', error);
    
    // Handle specific error cases
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked. Please allow popups for this site.');
    } else {
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }
};

// Sign out
export const signOutAdmin = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    const authUser = convertToAuthUser(user);
    callback(authUser);
  });
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  return convertToAuthUser(auth.currentUser);
};

// Check if current user is admin
export const isCurrentUserAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.isAdmin || false;
};