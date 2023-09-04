import { ReactNode, CSSProperties, useState } from "react";
import "./HamburgerMenu.css";

interface HamburgerMenuProps {
    style?: CSSProperties;
    barsStyle?: CSSProperties;
    children: ReactNode;
}

const HamburgerMenu = ({ style, barsStyle, children }: HamburgerMenuProps) => {

    const [isOpen, setIsOpen] = useState(false);

  return (
    <>
        <aside id="hamburger-menu" style={ style }>
            <div className={ `bars ${ isOpen ? 'x' : '' }` } style={ barsStyle } onClick={() => setIsOpen( !isOpen )}>
                <div id="bars"></div>
                <div id="bars"></div>
                <div id="bars"></div>
            </div>
        </aside>

        <aside className={`menu ${ isOpen ? 'open' : '' }`} onClick={() => setIsOpen(!isOpen)}>
            <nav>
                {
                    children
                }
            </nav>
        </aside>

    </>
  )
}

export default HamburgerMenu