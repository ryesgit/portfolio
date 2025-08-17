// import './outline.css';

import { useContext, lazy, Suspense } from "react"
import Container from "../../components/Container/index"
import Header from "../../components/Header/Header"
import Dashes from "../../components/ui/Dashes"
import "./Home.css"
import Hero from "./components/Hero/Hero"
import ProjectsSkeleton from "../../components/ui/SkeletonLoader/ProjectsSkeleton"
import ExperienceSkeleton from "../../components/ui/SkeletonLoader/ExperienceSkeleton"
import EducationSkeleton from "../../components/ui/SkeletonLoader/EducationSkeleton"

const Projects = lazy(() => import("./components/Projects/index"))
const Experience = lazy(() => import("./components/Experience/index"))
const Education = lazy(() => import("./components/Education/index"))
import DarkModeContext from "../../contexts/DarkModeProvider"

function Home() {

  const { dark } = useContext(DarkModeContext)

  return (
    <>
      <div className={`${ dark ? "dark" : "" }`}>
        <Header />
        <Container>
          <main id="main-content">
            <Dashes color="indianred" />
            <Hero id="hero" />
            <Dashes color="indianred" />
            <Suspense fallback={<ProjectsSkeleton />}>
              <Projects />
            </Suspense>
            <Dashes color="indianred" />
            <Suspense fallback={<ExperienceSkeleton />}>
              <Experience />
            </Suspense>
            <Dashes color="indianred" />
            <Suspense fallback={<EducationSkeleton />}>
              <Education />
            </Suspense>
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
