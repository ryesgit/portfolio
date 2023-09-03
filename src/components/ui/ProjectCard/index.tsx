import { ReactNode } from "react";
import RedIcon from "../RedIcon/index";
import "./ProjectCard.css";

const ProjectCard = ({ title, images, technologiesUsed, key } : { title: string, images?: string[], technologiesUsed:ReactNode[], key: string }) => {
  return (
    <section key={key}>
        <h3>{title}</h3>
        
        <div id="technology">
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


    </section>
  )
}

export default ProjectCard;