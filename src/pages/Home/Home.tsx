// import './outline.css';

import Header from "../../components/Header/Header"
import Dashes from "../../components/ui/Dashes"
import "./Home.css"
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

      </main>
    </>
  )
}

export default Home
