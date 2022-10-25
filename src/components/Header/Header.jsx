import { Link, NavLink } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/" className="home">
              <span>In The Same Boats</span>
            </Link>
          </li>
          <li>
            <NavLink to="instructions">Instructions</NavLink>
          </li>
          <li>
            <NavLink to="trajectories">Trajectories</NavLink>
          </li>
          <li>
            <NavLink to="intersections">Intersections</NavLink>
          </li>
          <li>
            <NavLink to="search">Search</NavLink>
          </li>
          <li>
            <NavLink to="credits">Credits</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
