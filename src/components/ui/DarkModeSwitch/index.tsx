import { useContext } from "react";
import "./DarkModeSwitch.css";
import DarkModeContext from "../../../contexts/DarkModeProvider";

import { BsSun, BsMoon } from "react-icons/bs";

const DarkModeSwitch = () => {

    const { dark, setDark } = useContext(DarkModeContext);

    return (
        <div>
            <BsSun aria-hidden="true" />
            <input 
                type="checkbox" 
                name="switch" 
                id="switch" 
                checked={dark}
                onChange={() => setDark && setDark(!dark)}
                aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
            />
            <BsMoon aria-hidden="true" />
        </div>
    )
}

export default DarkModeSwitch