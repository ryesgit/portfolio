// import './outline.css';

import Header from "../../components/Header/Header"
import Dashes from "../../components/ui/Dashes"
import "./Home.css"
import Hero from "./components/Hero/Hero"
import Projects from "./components/Projects/index"

function Home() {

  return (
    <>
      <Header />
      <main>

        <Dashes color="red" />

        <Hero id="hero" />

        <Dashes color="red" />

        <Projects />

      </main>
    </>
  )
}

export default Home
