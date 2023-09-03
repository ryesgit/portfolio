// import './outline.css';

import Header from "../../components/Header/Header"
import Dashes from "../../components/ui/Dashes"
import "./Home.css"
import Education from "./components/Education/index"
import Experience from "./components/Experience/index"
import Hero from "./components/Hero/Hero"
import Projects from "./components/Projects/index"

function Home() {

  return (
    <>
      <Header />
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
        <footer style={{textAlign: "center"}}>
        © Soliman, { new Date().getFullYear() }
        </footer>
      </aside>
    </>
  )
}

export default Home
