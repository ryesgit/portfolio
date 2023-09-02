import RedIcon from "../../../../components/ui/RedIcon/index";
import projects from "./data/projects";

const Projects = () => {
  return (
    <>
      <h2>Projects</h2>

      {
        projects.map((project) => {
          return (
            <div key={project.name} style={{textAlign: "center"}}>
              <h3>{project.name}</h3>
              <h3>Technologies Used</h3>
              {
                project.technologiesUsed.map((technology, index) => {
                  return (
                    <span key={index}>{
                      <RedIcon Icon={technology}/>
                    }</span>
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