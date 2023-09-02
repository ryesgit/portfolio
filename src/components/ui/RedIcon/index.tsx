import { ReactNode } from "react";
import { IconContext } from "react-icons"

const RedIcon = ({ Icon } : { Icon: ReactNode }) => {

  return (
    <IconContext.Provider value={{ color: "indianred", size: "2rem", style:{ margin: ".5rem" } }}>
        {
            Icon
        }
    </IconContext.Provider>
  )
}

export default RedIcon;