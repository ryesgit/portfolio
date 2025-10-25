import { 
  collection, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  QueryDocumentSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase.client';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  category: string;
  tags: string[];
  slug: string;
  readTime: number;
  published?: boolean;
}

export interface BlogPostInput {
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  category: string;
  tags: string | string[];
  slug: string;
  readTime: number;
  published?: boolean;
}

export interface BlogMeta {
  blogTitle: string;
  blogDescription: string;
  blogKeywords: string;
  authorName: string;
  siteUrl: string;
  ogImage: string;
  twitterHandle: string;
  googleAnalyticsId: string;
  favicon: string;
  themeColor: string;
}

const COLLECTION_NAME = 'blogPosts';
const META_DOCUMENT_ID = 'settings';

// Convert Firestore document to BlogPost
const convertFirestoreDoc = (doc: QueryDocumentSnapshot): BlogPost => {
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
};

// Get all published blog posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('published', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    
    querySnapshot.forEach((doc) => {
      posts.push(convertFirestoreDoc(doc));
    });
    
    // Sort by publishDate in JavaScript instead of Firestore
    posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

// Get all blog posts for admin (including drafts)
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const posts: BlogPost[] = [];
    
    querySnapshot.forEach((doc) => {
      posts.push(convertFirestoreDoc(doc));
    });
    
    // Sort by creation date (newest first) in JavaScript
    posts.sort((a, b) => {
      // If we don't have creation dates, sort by publish date
      const dateA = new Date(a.publishDate).getTime();
      const dateB = new Date(b.publishDate).getTime();
      return dateB - dateA;
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    return [];
  }
};

// Get a single blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('slug', '==', slug),
      where('published', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return convertFirestoreDoc(doc);
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    if (error?.code === 'permission-denied') {
      console.error('Firebase permission denied. Check Firestore security rules.');
    }
    return null;
  }
};

// Admin functions for content management

// Create a new blog post
export const createBlogPost = async (post: BlogPostInput): Promise<string | null> => {
  try {
    const now = Timestamp.now();
    
    // Handle publishDate - use provided date or current date if invalid
    let publishDate = now;
    if (post.publishDate) {
      const inputDate = new Date(post.publishDate);
      if (!isNaN(inputDate.getTime())) {
        publishDate = Timestamp.fromDate(inputDate);
      }
    }
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...post,
      publishDate,
      tags: Array.isArray(post.tags) ? post.tags : post.tags.split(',').map((tag: string) => tag.trim()),
      published: post.published || false,
      createdAt: now,
      updatedAt: now
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

// Update a blog post
export const updateBlogPost = async (id: string, updates: Partial<BlogPost>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    
    if (updates.publishDate) {
      updateData.publishDate = Timestamp.fromDate(new Date(updates.publishDate));
    }
    
    if (updates.tags) {
      updateData.tags = Array.isArray(updates.tags) ? updates.tags : updates.tags.split(',').map((tag: string) => tag.trim());
    }
    
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// Publish/unpublish a blog post
export const togglePublishStatus = async (id: string, published: boolean): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      published,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error toggling publish status:', error);
    throw error;
  }
};

// Get blog meta settings
export const getBlogMeta = async (): Promise<BlogMeta | null> => {
  try {
    const docRef = doc(db, 'meta', META_DOCUMENT_ID);
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
  } catch (error) {
    console.error('Error fetching blog meta:', error);
    return null;
  }
};

// Update blog meta settings
export const updateBlogMeta = async (meta: BlogMeta): Promise<boolean> => {
  try {
    const docRef = doc(db, 'meta', META_DOCUMENT_ID);
    await setDoc(docRef, {
      ...meta,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating blog meta:', error);
    throw error;
  }
};