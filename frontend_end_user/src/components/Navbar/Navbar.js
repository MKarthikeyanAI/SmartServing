import logo from '../images/logo.png';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Lyka Software Logo" height="50" />
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <ul className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <li>
            <Link to="/about-us" onClick={toggleMenu}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/smart-serve" onClick={toggleMenu}>
              Smart Serve
            </Link>
          </li>
          <li>
            <Link to="/custom-website" onClick={toggleMenu}>
              Custom Websites
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={toggleMenu}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
