import { useContext } from "react";
import "./DarkModeSwitch.css";
import DarkModeContext from "../../../contexts/DarkModeProvider";

import { BsSun, BsMoon } from "react-icons/bs";

const DarkModeSwitch = () => {

    const { dark, setDark } = useContext(DarkModeContext);

    return (
    <>
        <BsSun />
        <input type="checkbox" name="switch" id="switch" defaultChecked={dark}
        onClick={() => setDark!( !dark )} />
        <BsMoon />
    </>
    )
}

export default DarkModeSwitch