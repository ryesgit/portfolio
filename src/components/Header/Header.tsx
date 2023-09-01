import Logo from '../ui/Logo/Logo';
import './Header.css';

const Header = () => {
  return (
    <header>

      <Logo />

      <ul>
        <li>Home</li>
        <li>Projects</li>
        <li>Experience</li>
        <li>Education</li>
      </ul>
      
    </header>
  )
}

export default Header