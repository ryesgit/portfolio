import ProjectCard from "../../../../components/ui/ProjectCard/index";
import projects from "./data/projects";
import "./Projects.css";

const Projects = () => {
  return (
    <>
      <h2>Projects</h2>

      <div className="projects">
        {
          projects.map((project) => {
            return (
              <ProjectCard
                title={project.name}
                images={project.projectImages}
                technologiesUsed={project.technologiesUsed}
                key={project.name}
                />
            )
          })
        }
      </div>

    </>
  )
}

export default Projects;