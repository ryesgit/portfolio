import { CSSProperties, FC } from "react";
import "./Logo.css";

interface LogoProps {
  style?: CSSProperties
}

const Logo: FC<LogoProps> = ({ style = {} }) => {
  return (
    <svg id="logo" viewBox="0 0 56 18" style={style}>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
        Lee
      </text>
    </svg>
  )
}

export default Logo