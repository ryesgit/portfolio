import ProjectCard from "../../../../components/ui/ProjectCard/index";
import projects from "./data/projects";
import "./Projects.css";

const Projects = () => {

  return (
    <section id="projects">
      <h2>Projects</h2>


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

    </section>
  )
}

export default Projects;