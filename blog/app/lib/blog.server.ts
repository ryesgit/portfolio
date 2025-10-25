import type { BlogPost, BlogMeta } from './blog.client';

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

// Get all published blog posts
export const getAllBlogPosts = async (): Promise<BlogPost[] | null> => {
  try {
    const { initializeApp } = await import('firebase/app');
    const { getFirestore, collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
    
    const firebaseConfig = {
      apiKey: "AIzaSyDN4Rw6cp-Eo8en4AY_HAQp2JECw05pV4I",
      authDomain: "blogsite-a43e6.firebaseapp.com",
      projectId: "blogsite-a43e6",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const q = query(
      collection(db, 'blogPosts'),
      where('published', '==', true),
      orderBy('publishDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
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
      });
    });
    
    return posts;
  } catch (error: any) {
    console.error('Firebase error:', error);
    return null;
  }
};

export const getBlogMetaServer = async (): Promise<BlogMeta | null> => {
  try {
    const { initializeApp } = await import('firebase/app');
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');
    
    const firebaseConfig = {
      apiKey: "AIzaSyDN4Rw6cp-Eo8en4AY_HAQp2JECw05pV4I",
      authDomain: "blogsite-a43e6.firebaseapp.com",
      projectId: "blogsite-a43e6",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const docRef = doc(db, 'meta', 'settings');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as BlogMeta;
    } else {
      // Return default settings if no document exists
      return {
        blogTitle: 'Chug Blogs',
        blogDescription: 'A modern blog powered by React Router and Firebase',
        blogKeywords: 'blog, tech, programming, development',
        authorName: 'Lee Ryan Soliman',
        siteUrl: 'https://blog.leeryan.dev',
        ogImage: 'https://blog.leeryan.dev/og-image.jpg',
        twitterHandle: '@leeryansoliman',
        googleAnalyticsId: '',
        favicon: '/favicon.ico',
        themeColor: '#dc2626'
      };
    }
  } catch (error: any) {
    console.error('Firebase meta error:', error);
    return null;
  }
};