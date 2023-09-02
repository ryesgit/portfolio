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

      </main>
    </>
  )
}

export default Home
