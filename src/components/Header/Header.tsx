import DarkModeSwitch from '../ui/DarkModeSwitch/index';
import HamburgerMenu from '../ui/HamburgerMenu/index';
import './Header.css';
import logo from '../../assets/logo.jpg';

const Header = () => {
  return (
    <header>

      <h1>
        <img src={logo} alt="Logo" />
      </h1>

      <HamburgerMenu>
        <ul>
          <a href="#hero">
            <li>Home</li>
          </a>
          <a href="#projects">
            <li>Projects</li>
          </a>
          <a href="#experience">
            <li>Experience</li>
          </a>
          <a href="#education">
            <li>Education</li>
          </a>

          <DarkModeSwitch />

        </ul>
      </HamburgerMenu>

      <nav>
        <ul>
          <a href="#hero">
            <li>Home</li>
          </a>
          <a href="#projects">
            <li>Projects</li>
          </a>
          <a href="#experience">
            <li>Experience</li>
          </a>
          <a href="#education">
            <li>Education</li>
          </a>
          <DarkModeSwitch />
        </ul>
      </nav>
      
    </header>
  )
}

export default Header