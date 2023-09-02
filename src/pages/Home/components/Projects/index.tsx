import projects from "./data/projects";

const Projects = () => {
  return (
    <>
      <h2>Projects</h2>

      {
        projects.map((project) => {
          return (
            <div key={project.name}>
              <h3>{project.name}</h3>
              {
                project.technologiesUsed.map((technology, index) => {
                  return (
                    <span key={index}>{technology}</span>
                  )
                })
              }
            </div>
          )
        })
      }

    </>
  )
}

export default Projects;