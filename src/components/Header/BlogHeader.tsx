import { Link } from 'react-router-dom';
import HamburgerMenu from '../ui/HamburgerMenu/index';
import './Header.css';
import logo from '../../assets/logo.webp';

const BlogHeader = () => {
  return (
    <header>
      <h1>
        <Link to="/">
          <img src={logo} alt="Chug Blogs Logo" />
        </Link>
      </h1>

      <HamburgerMenu>
        <ul>
          {/* No dark mode switch for blog */}
        </ul>
      </HamburgerMenu>

      <nav aria-label="Main navigation">
        <ul>
          {/* No dark mode switch for blog */}
        </ul>
      </nav>
      
    </header>
  )
}

export default BlogHeader;