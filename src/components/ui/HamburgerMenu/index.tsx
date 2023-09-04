import { CSSProperties } from "react";
import "./HamburgerMenu.css";

const HamburgerMenu = ({ id, style, barsStyle }: { id: string, style? : CSSProperties, barsStyle? : CSSProperties}) => {
  return (
    <aside id={id} style={ style }>
        <div id="bars" style={ barsStyle }>
            <div className="bars"></div>
            <div className="bars"></div>
            <div className="bars"></div>
        </div>
    </aside>
  )
}

export default HamburgerMenu