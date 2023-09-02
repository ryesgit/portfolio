// import './outline.css';

import Header from "../../components/Header/Header"
import Dashes from "../../components/ui/Dashes"
import Logo from "../../components/ui/Logo/Logo"
import "./Home.css"
import { motion } from "framer-motion"

function Home() {

  return (
    <>
      <Header />
      <main>

        <Dashes color="red" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ rotate: 360, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}>

          <Logo style={{
            width: "10rem",
            maxHeight: "10rem",
            marginTop: "1rem"
          }}/>

        </motion.div>

          <article>

            <h1>Lee Ryan Soliman</h1>

            <h2>Student, Developer, Problem Solver</h2>

            <p style={{ lineHeight: "1.5rem" }}>
              incoming Computer Engineering sophomore; <br />
              helping clients with tech problems through freelance work, <br />
              while building fun toy projects on the side
            </p>

          </article>

          <Dashes color="red" />

      </main>
    </>
  )
}

export default Home
