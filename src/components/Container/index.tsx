import { ReactNode } from "react"
import "./Container.css";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container">
        {children}
    </div>
  )
}

export default Container;