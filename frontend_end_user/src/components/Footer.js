import React from "react";
import "../styles/Footer.css";
import { assets } from "../assets/assets.js";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = React.forwardRef((props, ref) => (
  <footer ref={ref} id="contact" className="footer"> {/* Use ref forwarding */}
    <div className="footer-content">
      <div className="footer-logo">
        <img src={assets.logo} alt="Logo" className="logo" />
      </div>
      <div className="footer-sections">
        <div className="company-section">
          <h3>COMPANY</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/delivery">Delivery</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="contact-section">
          <h3>GET IN TOUCH</h3>
          <p>+1-212-456-7890</p>
          <p>contact@smart-serve.com</p>
        </div>
      </div>
    </div>
    <div className="footer-social">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <FaFacebookF />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <FaTwitter />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <FaInstagram />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        <FaLinkedinIn />
      </a>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2025 smart-serve.com - All Rights Reserved.</p>
    </div>
  </footer>
));

export default Footer;
