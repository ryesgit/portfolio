// import './outline.css';

import { useContext } from "react"
import Container from "../../components/Container/index"
import Header from "../../components/Header/Header"
import Dashes from "../../components/ui/Dashes"
import "./Home.css"
import BlogHeader from "../../components/Blog/BlogHeader/BlogHeader"
import BlogPostCard from "../../components/Blog/BlogPostCard/BlogPostCard"
import BlogSidebar from "../../components/Blog/BlogSidebar/BlogSidebar"
import ChatBot from "../../components/AIChat/ChatBot"
import { blogPosts } from "../../data/blogPosts"
import DarkModeContext from "../../contexts/DarkModeProvider"

function Home() {

  const { dark } = useContext(DarkModeContext)

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
                {blogPosts.map((post) => (
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
