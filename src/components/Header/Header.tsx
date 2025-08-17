import DarkModeSwitch from '../ui/DarkModeSwitch/index';
import HamburgerMenu from '../ui/HamburgerMenu/index';
import './Header.css';
import logo from '../../assets/logo.webp';

const Header = () => {
  return (
    <header>

      <h1>
        <img src={logo} alt="Logo" />
      </h1>

      <HamburgerMenu>
        <ul>
          <li>
            <a href="#hero">Home</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a href="#experience">Experience</a>
          </li>
          <li>
            <a href="#education">Education</a>
          </li>

          <DarkModeSwitch />

        </ul>
      </HamburgerMenu>

      <nav>
        <ul>
          <li>
            <a href="#hero">Home</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a href="#experience">Experience</a>
          </li>
          <li>
            <a href="#education">Education</a>
          </li>
          <DarkModeSwitch />
        </ul>
      </nav>
      
    </header>
  )
}

export default Header