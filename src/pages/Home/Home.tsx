import { useContext } from "react"
import Container from "../../components/Container/index"
import Header from "../../components/Header/Header"
import Hero from "./components/Hero/Hero"
import Experience from "./components/Experience/index"
import Projects from "./components/Projects/index"
import Education from "./components/Education/index"
import Dashes from "../../components/ui/Dashes"
import "./Home.css"
import ChatBot from "../../components/AIChat/ChatBot"
import DarkModeContext from "../../contexts/DarkModeProvider"

function Home() {
  const { dark } = useContext(DarkModeContext)

  return (
    <>
      <div className={`${ dark ? "dark" : "light" }`}>
        <Header />
        <Container>
          <main id="main-content">
            <Hero />
            <Dashes color="indianred" />
            <Experience />
            <Dashes color="indianred" />
            <Projects />
            <Dashes color="indianred" />
            <Education />
            <Dashes color="indianred" />
          </main>
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
