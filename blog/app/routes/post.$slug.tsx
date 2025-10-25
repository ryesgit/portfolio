import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { getBlogPostBySlug } from "~/lib/blog.server";
import { type BlogPost } from "~/lib/blog.client";
import "~/styles/blog.css";

// Client-side utility function
function getFirstImageFromContent(content: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)|<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = content.match(imageRegex);
  return match ? match[1] || match[2] : null;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return [
      { title: "Post Not Found - Chug Blogs" },
      {
        name: "description",
        content: "The requested blog post could not be found.",
      },
    ];
  }

  const { post } = data;
  const seoImage =
    getFirstImageFromContent(post.content) ||
    "https://blog.leeryan.dev/og-image.jpg";

  return [
    { title: `${post.title} - Chug Blogs` },
    { name: "description", content: post.excerpt },
    { name: "keywords", content: post.tags.join(", ") },
    { name: "author", content: "Lee Ryan Soliman" },
    { name: "robots", content: "index, follow" },

    // Open Graph / Facebook
    { property: "og:type", content: "article" },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.excerpt },
    {
      property: "og:url",
      content: `https://blog.leeryan.dev/post/${post.slug}`,
    },
    { property: "og:site_name", content: "Chug Blogs" },
    { property: "og:image", content: seoImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: "en_US" },
    { property: "article:author", content: "Lee Ryan Soliman" },
    { property: "article:published_time", content: post.publishDate },
    { property: "article:section", content: post.category },
    ...post.tags.map((tag) => ({ property: "article:tag", content: tag })),

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.title },
    { name: "twitter:description", content: post.excerpt },
    { name: "twitter:image", content: seoImage },
    { name: "twitter:creator", content: "@leeryansoliman" },

    // Additional SEO
    { name: "theme-color", content: "#dc2626" },
    {
      tagName: "link",
      rel: "canonical",
      href: `https://blog.leeryan.dev/post/${post.slug}`,
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      throw new Response("Not Found", { status: 404 });
    }

    return { post };
  } catch (error) {
    console.error("Error loading post:", error);
    throw new Response("Not Found", { status: 404 });
  }
}

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="blog-list-container">
      <div className="blog-content">
        <div className="blog-main">
          <nav className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-red-400 hover:text-red-500 transition-colors"
            >
              ← Back to Blog
            </Link>
          </nav>

          <article className="blog-post">
            <header className="post-header">
              <div className="category-badge">
                <span className="category">{post.category}</span>
              </div>

              <h1 className="post-title">{post.title}</h1>

              <div className="post-meta">
                <time dateTime={post.publishDate} className="post-date">
                  {formatDate(post.publishDate)}
                </time>
                <span className="post-read-time">{post.readTime} min read</span>
              </div>

              <div className="post-excerpt">
                <p>{post.excerpt}</p>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="post-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
                components={{
                  pre: ({ children, ...props }) => (
                    <pre className="code-block" {...props}>
                      {children}
                    </pre>
                  ),
                  code: ({ children, ...props }) => (
                    <code className="inline-code" {...props}>
                      {children}
                    </code>
                  ),
                  blockquote: ({ children, ...props }) => (
                    <blockquote className="quote" {...props}>
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children, ...props }) => (
                    <h1 className="content-h1" {...props}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className="content-h2" {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="content-h3" {...props}>
                      {children}
                    </h3>
                  ),
                  a: ({ children, href, ...props }) => (
                    <a
                      href={href}
                      className="content-link"
                      target={href?.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href?.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children, ...props }) => (
                    <ul className="content-list" {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="content-list ordered" {...props}>
                      {children}
                    </ol>
                  ),
                  p: ({ children, ...props }) => (
                    <p className="content-paragraph" {...props}>
                      {children}
                    </p>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>

        <aside className="blog-sidebar">
          <div className="sidebar-section">
            <h3>About This Post</h3>
            <ul className="post-details">
              <li>
                <strong>Published:</strong> {formatDate(post.publishDate)}
              </li>
              <li>
                <strong>Category:</strong> {post.category}
              </li>
              <li>
                <strong>Read Time:</strong> {post.readTime} minutes
              </li>
            </ul>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="sidebar-section">
              <h3>Tags</h3>
              <div className="sidebar-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="sidebar-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="sidebar-section">
            <h3>Navigation</h3>
            <ul className="category-list">
              <li>
                <Link to="/">← All Posts</Link>
              </li>
              <li>
                <a href="#top">↑ Back to Top</a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
