// Simple Firebase test endpoint
export default async function handler(req, res) {
  try {
    console.log('Testing Firebase connection...');
    
    // Test environment variables
    const envCheck = {
      hasApiKey: !!process.env.VITE_FIREBASE_API_KEY,
      hasProjectId: !!process.env.VITE_FIREBASE_PROJECT_ID,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID
    };
    
    console.log('Environment variables:', envCheck);
    
    // Try to import Firebase
    const { initializeApp, getApps } = require('firebase/app');
    const { getFirestore, collection, getDocs } = require('firebase/firestore');
    
    console.log('Firebase modules imported successfully');
    
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID
    };
    
    console.log('Firebase config created');
    
    // Initialize Firebase
    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    console.log('Firebase app initialized');
    
    const db = getFirestore(app);
    console.log('Firestore initialized');
    
    // Try to list all blog posts
    const postsRef = collection(db, 'blogPosts');
    const querySnapshot = await getDocs(postsRef);
    
    console.log('Query executed, docs found:', querySnapshot.size);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        slug: doc.data().slug,
        title: doc.data().title
      });
    });
    
    console.log('Posts found:', posts);
    
    res.json({
      success: true,
      environment: envCheck,
      postsCount: posts.length,
      posts: posts
    });
    
  } catch (error) {
    console.error('Firebase test error:', error);
    res.json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}