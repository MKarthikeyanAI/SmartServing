
import logo from '../images/logo.png';

import React from 'react';
import { Link } from 'react-router-dom'; // Use Link from react-router-dom
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Lyka Software Logo" height="50" />
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/about-us">About Us</Link> {/* Regular Link */}
          </li>
          <li>
            <Link to="/smart-serve">Smart Serve</Link> {/* Regular Link */}
          </li>
          <li>
            <Link to="/custom-website">Custom Websites</Link> {/* Regular Link */}
          </li>
          <li>
            <Link to="/contact">Contact</Link> {/* Regular Link */}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;