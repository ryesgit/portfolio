import type { BlogPost } from './blog.client';

// Get a single blog post by slug from Firebase
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    // Dynamic import to avoid SSR issues
    const { initializeApp } = await import('firebase/app');
    const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore');
    
    const firebaseConfig = {
      apiKey: "AIzaSyDN4Rw6cp-Eo8en4AY_HAQp2JECw05pV4I",
      authDomain: "blogsite-a43e6.firebaseapp.com",
      projectId: "blogsite-a43e6",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const q = query(
      collection(db, 'blogPosts'),
      where('slug', '==', slug),
      where('published', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      publishDate: data.publishDate.toDate().toISOString().split('T')[0],
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      slug: data.slug,
      readTime: data.readTime,
      published: data.published || false
    };
  } catch (error: any) {
    console.error('Firebase error:', error);
    if (error?.code === 'permission-denied') {
      console.error('Firebase permission denied. Check Firestore security rules.');
    }
    return null;
  }
};