import { blogPosts } from '../data/blogPosts';
import { createBlogPost, togglePublishStatus } from '../services/blogService';

// Migration utility to move static blog posts to Firestore
// Run this once to populate your Firestore database
export const migrateBlogPostsToFirestore = async () => {
  console.log('Starting migration of blog posts to Firestore...');
  
  try {
    for (const post of blogPosts) {
      console.log(`Migrating: ${post.title}`);
      
      // Create the post (starts as unpublished)
      const postId = await createBlogPost({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        publishDate: post.publishDate,
        category: post.category,
        tags: post.tags,
        slug: post.slug,
        readTime: post.readTime
      });
      
      if (postId) {
        // Publish the post
        await togglePublishStatus(postId, true);
        console.log(`✅ Successfully migrated: ${post.title}`);
      } else {
        console.log(`❌ Failed to migrate: ${post.title}`);
      }
    }
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

// Helper function to call migration from browser console
// You can run this in the browser dev tools after setting up Firebase
(window as any).migrateBlogPosts = migrateBlogPostsToFirestore;