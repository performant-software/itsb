import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Header.css';

/**
 * Header component, containing navigation links to pages in the application.
 *
 * @returns {React.ReactElement} Header React functional component
 */
export function Header() {
  // hide mobile menu after navigating
  const location = useLocation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  useEffect(() => {
    setMobileMenuVisible(false);
  }, [location]);

  return (
    <header>
      <nav>
        <div className="home">
          <Link to="/">
            <span>In The Same Boats</span>
          </Link>
        </div>
        <input
          id="mobile-nav-toggle"
          name="mobile-nav-toggle"
          type="checkbox"
          checked={mobileMenuVisible}
          onChange={() => {
            setMobileMenuVisible((prevState) => !prevState);
          }}
        />
        <label htmlFor="mobile-nav-toggle">
          <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>
        </label>
        <ul>
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
