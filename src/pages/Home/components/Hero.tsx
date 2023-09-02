import { motion } from "framer-motion"
import Logo from "../../../components/ui/Logo/Logo"

const Hero = ({ id } : { id?:string }) => {
  return (
        <main id={id}>
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
        </main>
  )
}

export default Hero