// import './outline.css';

import { useContext } from "react"
import Container from "../../components/Container/index"
import Header from "../../components/Header/Header"
import Dashes from "../../components/ui/Dashes"
import "./Home.css"
import Education from "./components/Education/index"
import Experience from "./components/Experience/index"
import Hero from "./components/Hero/Hero"
import Projects from "./components/Projects/index"
import DarkModeContext from "../../contexts/DarkModeProvider"

function Home() {

  const { dark } = useContext(DarkModeContext)

  return (
    <>
      <div className={`${ dark ? "dark" : "" }`}>
        <Header />
        <Container>
          <main>
            <Dashes color="indianred" />
            <Hero id="hero" />
            <Dashes color="indianred" />
            <Projects />
            <Dashes color="indianred" />
            <Experience />
            <Dashes color="indianred" />
            <Education />
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
      </div>
    </>
  )
}

export default Home
