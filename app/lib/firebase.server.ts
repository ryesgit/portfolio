import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  QueryDocumentSnapshot 
} from 'firebase/firestore';
import { db } from './firebase.client';
import { BlogPost } from '~/types/blog';

export interface FirestoreBlogPost extends Omit<BlogPost, 'id' | 'publishDate'> {
  publishDate: Timestamp;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION_NAME = 'blogPosts';

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
    tags: data.tags,
    slug: data.slug,
    readTime: data.readTime,
    published: data.published || false
  };
};

// Get all published blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
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
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
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
}

// Extract first image from markdown content
export function getFirstImageFromContent(content: string): string | null {
  if (!content) return null;
  
  // Match markdown image syntax: ![alt](url) or ![alt](url "title")
  const markdownImageRegex = /!\[.*?\]\((.*?)(?:\s+".*?")?\)/;
  const match = content.match(markdownImageRegex);
  
  if (match && match[1]) {
    const imageUrl = match[1].trim();
    // Return the URL as-is if it's already absolute
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // If relative URL, make it absolute
    return `https://blog.leeryan.dev${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
  }
  
  return null;
}