import { ReactNode } from "react";
import RedIcon from "../RedIcon/index";
import { SiGithub } from "react-icons/si";
import { FiGlobe } from "react-icons/fi";
import "./ProjectCard.css";

interface ProjectCardProps {
    title: string,
    images?: ReactNode,
    technologiesUsed: ReactNode[],
    githubLink?: string,
    liveLink?: string,
    key: string
}

const ProjectCard = ({ title, images, technologiesUsed, githubLink, liveLink, key } : ProjectCardProps) => {
  return (
    <section key={key}>
        <h3>{title}</h3>
        
        <div>
            {
                images
            }
        </div>

        <div id="technologies">
            {
                technologiesUsed.map((technology, index) => {
                    return (
                        <div key={index}>
                            <RedIcon Icon={technology}/>
                        </div>
                    )
                })
            }
        </div>
        
        <div className="links">
            {
                githubLink && (<span>
                    <SiGithub /> <a href={githubLink}>Github</a>
                </span>)
            }
            {
                liveLink && (<span>
                    <FiGlobe /> <a href={liveLink}>Live Link</a>
                </span>)
            }
        </div>

    </section>
  )
}

export default ProjectCard;