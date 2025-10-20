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

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Modern Web Applications with React and TypeScript",
    excerpt: "Exploring the benefits of using TypeScript with React for building scalable and maintainable web applications. Learn about type safety, better developer experience, and improved code quality.",
    content: "TypeScript has become an essential tool for modern React development...",
    publishDate: "2024-01-15",
    category: "Development",
    tags: ["React", "TypeScript", "Web Development", "Frontend"],
    slug: "react-typescript-modern-web-apps",
    readTime: 8
  },
  {
    id: "2",
    title: "The Art of Clean Code: Principles Every Developer Should Know",
    excerpt: "Understanding the fundamental principles of writing clean, readable, and maintainable code. From naming conventions to function design, discover the practices that make code truly beautiful.",
    content: "Clean code is not just about making your code work; it's about making it work well...",
    publishDate: "2024-01-10",
    category: "Best Practices",
    tags: ["Clean Code", "Software Engineering", "Best Practices"],
    slug: "art-of-clean-code-principles",
    readTime: 12
  },
  {
    id: "3",
    title: "Exploring AI Integration in Modern Development Workflows",
    excerpt: "How artificial intelligence is transforming the way we write, test, and deploy code. From code completion to automated testing, AI is reshaping developer productivity.",
    content: "The integration of AI into development workflows is no longer a future concept...",
    publishDate: "2024-01-05",
    category: "AI & Technology",
    tags: ["AI", "Development Tools", "Productivity", "Machine Learning"],
    slug: "ai-integration-development-workflows",
    readTime: 10
  },
  {
    id: "4",
    title: "Performance Optimization Techniques for React Applications",
    excerpt: "Dive deep into React performance optimization strategies. Learn about memoization, code splitting, lazy loading, and other techniques to make your React apps lightning fast.",
    content: "Performance is crucial for user experience in React applications...",
    publishDate: "2023-12-28",
    category: "Performance",
    tags: ["React", "Performance", "Optimization", "Web Development"],
    slug: "react-performance-optimization-techniques",
    readTime: 15
  },
  {
    id: "5",
    title: "My Journey into Computer Engineering: Lessons Learned",
    excerpt: "Reflecting on my experience as a Computer Engineering student. The challenges, discoveries, and insights that shaped my understanding of technology and problem-solving.",
    content: "Starting my journey in Computer Engineering, I had many expectations...",
    publishDate: "2023-12-20",
    category: "Personal",
    tags: ["Education", "Computer Engineering", "Personal Growth", "Career"],
    slug: "computer-engineering-journey-lessons",
    readTime: 6
  }
];

export const categories = [
  "Development",
  "Best Practices", 
  "AI & Technology",
  "Performance",
  "Personal"
];

export const getAllTags = (): string[] => {
  const allTags = blogPosts.flatMap(post => post.tags);
  return [...new Set(allTags)].sort();
};