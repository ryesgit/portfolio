import ProjectCard from "../../../../components/ui/ProjectCard/index";
import projects from "./data/projects";
import { motion } from "framer-motion";
import "./Projects.css";

const Projects = () => {
  return (
    <>
      <h2>Projects</h2>

      <motion.div
        initial={{scale: 0}}
        whileInView={{scale: 1}}>
        <div className="projects">
          {
            projects.map((project) => {
              return (
                <ProjectCard
                  title={project.name}
                  images={project.projectImages}
                  technologiesUsed={project.technologiesUsed}
                  liveLink={project.liveLink}
                  githubLink={project.githubLink}
                  key={project.name}
                  />
              )
            })
          }
        </div>
      </motion.div>

    </>
  )
}

export default Projects;