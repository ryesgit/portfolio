import { cb1, cb2, cb3, cb4, cb5 } from "./chugBlogsImages";
import { ReactNode } from "react";
import { SiMongodb, SiNodedotjs, SiTailwindcss, SiTypescript } from "react-icons/si";

interface project {
    name: string,
    projectImages?: string[],
    technologiesUsed: ReactNode[]
}

const projects: project[] = [{
    name: "Chug Blogs",
    technologiesUsed: [<SiTypescript />, <SiNodedotjs />, <SiMongodb />, <SiTailwindcss />],
    projectImages: [cb1, cb2, cb3, cb4, cb5]
}]

export default projects;