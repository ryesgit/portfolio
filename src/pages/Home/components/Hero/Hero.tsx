import { motion } from "framer-motion";
import { useContext } from "react";
import DarkModeContext from "../../../../contexts/DarkModeProvider";
import "./Hero.css";
import links from "./data/links";

const Hero = ({ id }: { id?: string }) => {
  const { dark } = useContext(DarkModeContext);

  return (
    <section id={id}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      ></motion.div>

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <h1>Lee Ryan Soliman</h1>
        <div className="links">
          {links.map((link, index) => {
            return (
              <span
                id="link"
                key={index}
                className={`${!dark ? "lightLink" : ""}`}
              >
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.icon} <br />
                  <p>{link.platform}</p>
                </a>
              </span>
            );
          })}
        </div>

        <article>
          <h2>Blogger, Developer, Tech Enthusiast</h2>
          <p>
            Sharing insights on technology, <br />
            development experiences, and <br />
            creative projects through writing.
          </p>
        </article>
      </motion.div>
    </section>
  );
};

export default Hero;
