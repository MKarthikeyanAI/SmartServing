// src/components/Header.js
import React from 'react';
import '../styles/Header.css';
import { assets } from '../assets/assets.js'; // Ensure this path is correct

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo-container">
        <img src={assets.logo_back_remove} alt="SmartServing Logo" className="header-logo" />
      </div>
      <div className="header-title">
        <h1>Welcome to SmartServing</h1>
      </div>
    </header>
  );
};

export default Header;
