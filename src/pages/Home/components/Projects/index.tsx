import ProjectCard from "../../../../components/ui/ProjectCard/index";
import projects from "./data/projects";

const Projects = () => {
  return (
    <>
      <h2>Projects</h2>

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

    </>
  )
}

export default Projects;