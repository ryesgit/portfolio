import { cb1, cb2, cb3, cb4, cb5 } from "./chugBlogsImages";
import hpmg1 from "../assets/hpmg-1.webp";
import ccta1 from "../assets/ccta-1.webp";
import ccta2 from "../assets/ccta-2.webp";
import tv1 from "../assets/tv-1.webp";
import tv2 from "../assets/tv-2.webp";
import srd1 from "../assets/srd-1.webp";

import { ReactNode } from "react";
import { SiCss3, SiJavascript, SiMongodb, SiNodedotjs, SiPython, SiReact, SiTailwindcss, SiTypescript } from "react-icons/si";
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
    },
    {
        name: "Covid-19 Contact-Tracing Application",
        technologiesUsed: [<SiPython />],
        projectImages: < Slideshow images={[ccta1, ccta2]}/>,
        githubLink: "https://github.com/ryesgit/covid-contract-tracing",
    },
    {
        name: "Television",
        technologiesUsed: [<SiPython />, <SiReact />, <SiJavascript />, <SiTailwindcss />],
        projectImages: < Slideshow images={[tv1, tv2]}/>,
        githubLink: "https://github.com/ryesgit/television",
        liveLink: "https://television.onrender.com/"
    },
    {
        name: "Set Relation Determinator",
        technologiesUsed: [<SiReact />, <SiJavascript />, <SiCss3 />],
        githubLink: "https://github.com/codenamerey/set-relation-determinator-tdd",
        liveLink: "https://codenamerey.github.io/set-relation-determinator-tdd/",
        projectImages: <img src={srd1} />
    }
    ]

export default projects;