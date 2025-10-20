import { Link, useLocation } from 'react-router-dom';
import DarkModeSwitch from '../ui/DarkModeSwitch/index';
import HamburgerMenu from '../ui/HamburgerMenu/index';
import './Header.css';
import logo from '../../assets/logo.webp';

const Header = () => {
  const location = useLocation();
  const isPortfolioPage = location.pathname === '/portfolio';

  return (
    <header>

      {isPortfolioPage && (
        <h1>
          <Link to="/">
            <img src={logo} alt="Lee Ryan Soliman Portfolio Logo" />
          </Link>
        </h1>
      )}

      <HamburgerMenu>
        <ul>
          <li>
            <Link to="/" aria-label="Navigate to blog">Blog</Link>
          </li>
          <li>
            <Link to="/portfolio" aria-label="Navigate to portfolio">Portfolio</Link>
          </li>

          <DarkModeSwitch />

        </ul>
      </HamburgerMenu>

      <nav aria-label="Main navigation">
        <ul>
          <li>
            <Link to="/" aria-label="Navigate to blog">Blog</Link>
          </li>
          <li>
            <Link to="/portfolio" aria-label="Navigate to portfolio">Portfolio</Link>
          </li>
          <DarkModeSwitch />
        </ul>
      </nav>
      
    </header>
  )
}

export default Header