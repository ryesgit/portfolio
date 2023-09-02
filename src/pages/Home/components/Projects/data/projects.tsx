import { cb1, cb2, cb3, cb4, cb5 } from "./chugBlogsImages";
import { SiGithub } from "react-icons/si";
import { ReactNode } from "react";

interface project {
    name: string,
    projectImages?: string[],
    technologiesUsed: ReactNode[]
}

const projects: project[] = [{
    name: "Chug Blogs",
    technologiesUsed: [<SiGithub />],
    projectImages: [cb1, cb2, cb3, cb4, cb5]
}]

export default projects;