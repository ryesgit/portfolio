// import './outline.css';

import { useContext, useEffect, useState } from "react"
import Container from "../../components/Container/index"
import Header from "../../components/Header/Header"
import Dashes from "../../components/ui/Dashes"
import "./Home.css"
import BlogHeader from "../../components/Blog/BlogHeader/BlogHeader"
import BlogPostCard from "../../components/Blog/BlogPostCard/BlogPostCard"
import BlogSidebar from "../../components/Blog/BlogSidebar/BlogSidebar"
import BlogPostsSkeleton from "../../components/ui/SkeletonLoader/BlogPostSkeleton"
import ChatBot from "../../components/AIChat/ChatBot"
import { BlogPost } from "../../data/blogPosts"
import { getBlogPosts } from "../../services/blogService"
import DarkModeContext from "../../contexts/DarkModeProvider"

function Home() {
  const { dark } = useContext(DarkModeContext)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const fetchedPosts = await getBlogPosts()
        setPosts(fetchedPosts)
      } catch (err) {
        setError('Failed to load blog posts')
        console.error('Error fetching posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <>
      <div className={`${ dark ? "dark" : "light" }`}>
        <Header />
        <Container>
          <main id="main-content">
            <Dashes color="indianred" />
            <BlogHeader />
            <Dashes color="indianred" />
            
            <div className="blog-layout">
              <section className="blog-posts">
                <h2>Recent Posts</h2>
                {loading && <BlogPostsSkeleton />}
                {error && <div className="error-message">{error}</div>}
                {!loading && !error && posts.length === 0 && (
                  <div className="no-posts">No blog posts found.</div>
                )}
                {!loading && !error && posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </section>
              
              <BlogSidebar />
            </div>
          </main>
          <Dashes color="indianred" />
          <aside>
            <footer style={{
              textAlign: "center",
              padding: "1rem 2rem",
              }}>
            © Soliman, { new Date().getFullYear() }
            </footer>
          </aside>
        </Container>
        <ChatBot />
      </div>
    </>
  )
}

export default Home
