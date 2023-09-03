import { motion } from "framer-motion"
import Logo from "../../../../components/ui/Logo/Logo"
import "./Hero.css"

const Hero = ({ id } : { id?:string }) => {
  return (
        <section id={id}>
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


            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}>
                <article>
                <h1>Lee Ryan Soliman</h1>
                <h2>Student, Developer, Problem Solver</h2>
                <p>
                    Incoming Computer Engineering sophomore; <br />
                    Helping clients with tech problems <br />
                    While building fun toy projects on the side
                </p>
                </article>
            </motion.div>

        </section>
  )
}

export default Hero