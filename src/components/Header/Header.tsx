import HamburgerMenu from '../ui/HamburgerMenu/index';
import './Header.css';

const Header = () => {
  return (
    <header>

      <h1>Lee</h1>

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
        </ul>
      </nav>
      
    </header>
  )
}

export default Header