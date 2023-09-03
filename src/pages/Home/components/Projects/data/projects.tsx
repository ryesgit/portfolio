import { cb1, cb2, cb3, cb4, cb5 } from "./chugBlogsImages";
import hpmg1 from "../assets/hpmg-1.jpg";

import { ReactNode } from "react";
import { SiCss3, SiJavascript, SiMongodb, SiNodedotjs, SiReact, SiTailwindcss, SiTypescript } from "react-icons/si";
import Slideshow from "../../../../../components/ui/Slideshow/index";

interface project {
    name: string,
    projectImages?: ReactNode,
    technologiesUsed: ReactNode[],
    liveLink?: string,
    githubLink?: string
}

const projects: project[] = [
    {
        name: "Chug Blogs",
        technologiesUsed: [<SiTypescript />, <SiNodedotjs />, <SiMongodb />, <SiTailwindcss />],
        projectImages: <Slideshow images={[cb1, cb2, cb3, cb4, cb5]} />,
        githubLink: "https://github.com/codenamerey/chug-blogs-client"
    },
    {
        name: "Harry Potter Memory Game",
        technologiesUsed: [<SiReact />, <SiJavascript />, <SiCss3 />],
        projectImages: <img src={hpmg1} />,
        githubLink: "https://github.com/codenamerey/memory-card",
        liveLink: "https://codenamerey.github.io/memory-card/"
    }
    ]

export default projects;