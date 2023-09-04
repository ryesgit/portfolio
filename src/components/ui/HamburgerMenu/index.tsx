import { CSSProperties, useState } from "react";
import "./HamburgerMenu.css";

const HamburgerMenu = ({ id, style, barsStyle }: { id: string, style? : CSSProperties, barsStyle? : CSSProperties}) => {

    const [isOpen, setIsOpen] = useState(false);

  return (
    <aside id={id} style={ style }>
        <div className={ `bars ${ isOpen ? 'x' : '' }` } style={ barsStyle } onClick={() => setIsOpen( !isOpen )}>
            <div id="bars"></div>
            <div id="bars"></div>
            <div id="bars"></div>
        </div>
    </aside>
  )
}

export default HamburgerMenu