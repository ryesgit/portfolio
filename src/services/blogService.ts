import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  DocumentData,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { BlogPost } from '../data/blogPosts';

const COLLECTION_NAME = 'blogPosts';

export interface FirestoreBlogPost extends Omit<BlogPost, 'id' | 'publishDate'> {
  publishDate: Timestamp;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Convert Firestore document to BlogPost
const convertFirestoreDoc = (doc: DocumentData): BlogPost => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    publishDate: data.publishDate.toDate().toISOString().split('T')[0],
    category: data.category,
    tags: data.tags,
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
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

// Get posts by category
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('category', '==', category),
      where('published', '==', true),
      orderBy('publishDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    
    querySnapshot.forEach((doc) => {
      posts.push(convertFirestoreDoc(doc));
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
};

// Get posts by tag
export const getBlogPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('tags', 'array-contains', tag),
      where('published', '==', true),
      orderBy('publishDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    
    querySnapshot.forEach((doc) => {
      posts.push(convertFirestoreDoc(doc));
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }
};

// Admin functions (for content management)

// Create a new blog post
export const createBlogPost = async (post: Omit<BlogPost, 'id'>): Promise<string | null> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...post,
      publishDate: Timestamp.fromDate(new Date(post.publishDate)),
      published: false, // Start as draft
      createdAt: now,
      updatedAt: now
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating blog post:', error);
    return null;
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
    
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating blog post:', error);
    return false;
  }
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
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
    return false;
  }
};