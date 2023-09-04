import { BsGithub, BsLinkedin } from "react-icons/bs";

interface link {
    platform: string;
    url: string;
    icon: any;
}

const links: link[] = [
    {
        platform: "Github",
        url: "https://github.com/codenamerey",
        icon: <BsGithub size="2rem" />
    },
    {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/lee-ryan-soliman-783581244/",
        icon: <BsLinkedin size="2rem" />
    }
]

export default links;