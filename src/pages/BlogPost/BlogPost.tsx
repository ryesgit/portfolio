import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../../components/Container/index';
import Header from '../../components/Header/Header';
import Dashes from '../../components/ui/Dashes';
import ChatBot from '../../components/AIChat/ChatBot';
import { BlogPost as BlogPostType } from '../../data/blogPosts';
import { getBlogPostBySlug } from '../../services/blogService';
import DarkModeContext from '../../contexts/DarkModeProvider';
import './BlogPost.css';

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { dark } = useContext(DarkModeContext);
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('Post not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedPost = await getBlogPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`${dark ? "dark" : "light"}`}>
        <Header />
        <Container>
          <main id="main-content">
            <div className="blog-post-loading">
              <div className="loading-spinner"></div>
              <p>Loading post...</p>
            </div>
          </main>
        </Container>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={`${dark ? "dark" : "light"}`}>
        <Header />
        <Container>
          <main id="main-content">
            <Dashes color="indianred" />
            <div className="blog-post-error">
              <h1>Post Not Found</h1>
              <p>{error || 'The blog post you are looking for does not exist.'}</p>
              <Link to="/" className="back-home-link">
                ← Back to Blog
              </Link>
            </div>
            <Dashes color="indianred" />
          </main>
        </Container>
      </div>
    );
  }

  return (
    <>
      <div className={`${dark ? "dark" : "light"}`}>
        <Header />
        <Container>
          <main id="main-content">
            <Dashes color="indianred" />
            
            <article className="blog-post-detail">
              <div className="post-header">
                <Link to="/" className="back-link">
                  ← Back to Blog
                </Link>
                
                <div className="post-meta">
                  <span className="post-category">{post.category}</span>
                  <span className="post-date">{formatDate(post.publishDate)}</span>
                  <span className="read-time">{post.readTime} min read</span>
                </div>
                
                <h1 className="post-title">{post.title}</h1>
                
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="post-content">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="content-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className="post-footer">
                <div className="post-info">
                  <p className="post-excerpt-footer">
                    <strong>Summary:</strong> {post.excerpt}
                  </p>
                </div>
                
                <div className="post-navigation">
                  <Link to="/" className="nav-button">
                    ← All Posts
                  </Link>
                </div>
              </div>
            </article>
            
            <Dashes color="indianred" />
          </main>
          <aside>
            <footer style={{
              textAlign: "center",
              padding: "1rem 2rem",
            }}>
              © Soliman, {new Date().getFullYear()}
            </footer>
          </aside>
        </Container>
        <ChatBot />
      </div>
    </>
  );
}

export default BlogPost;