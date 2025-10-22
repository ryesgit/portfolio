import { Link } from 'react-router-dom';
import DarkModeSwitch from '../ui/DarkModeSwitch/index';
import HamburgerMenu from '../ui/HamburgerMenu/index';
import './Header.css';
import logo from '../../assets/logo.webp';

const Header = () => {
  return (
    <header>
      <h1>
        <Link to="/">
          <img src={logo} alt="Lee Ryan Soliman Portfolio Logo" />
        </Link>
      </h1>

      <HamburgerMenu>
        <ul>
          <DarkModeSwitch />
        </ul>
      </HamburgerMenu>

      <nav aria-label="Main navigation">
        <ul>
          <DarkModeSwitch />
        </ul>
      </nav>
      
    </header>
  )
}

export default Header