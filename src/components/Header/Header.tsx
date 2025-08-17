import DarkModeSwitch from '../ui/DarkModeSwitch/index';
import HamburgerMenu from '../ui/HamburgerMenu/index';
import './Header.css';
import logo from '../../assets/logo.webp';

const Header = () => {
  return (
    <header>

      <h1>
        <img src={logo} alt="Lee Ryan Soliman Portfolio Logo" />
      </h1>

      <HamburgerMenu>
        <ul>
          <li>
            <a href="#hero" aria-label="Navigate to home section">Home</a>
          </li>
          <li>
            <a href="#projects" aria-label="Navigate to projects section">Projects</a>
          </li>
          <li>
            <a href="#experience" aria-label="Navigate to experience section">Experience</a>
          </li>
          <li>
            <a href="#education" aria-label="Navigate to education section">Education</a>
          </li>

          <DarkModeSwitch />

        </ul>
      </HamburgerMenu>

      <nav aria-label="Main navigation">
        <ul>
          <li>
            <a href="#hero" aria-label="Navigate to home section">Home</a>
          </li>
          <li>
            <a href="#projects" aria-label="Navigate to projects section">Projects</a>
          </li>
          <li>
            <a href="#experience" aria-label="Navigate to experience section">Experience</a>
          </li>
          <li>
            <a href="#education" aria-label="Navigate to education section">Education</a>
          </li>
          <DarkModeSwitch />
        </ul>
      </nav>
      
    </header>
  )
}

export default Header