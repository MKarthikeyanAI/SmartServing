import React from 'react';
import '../styles/LandingPage.css'; // Import the CSS file
import { Link } from 'react-scroll'; // Import Link from react-scroll
import { assets } from "../assets/assets.js";

const LandingPage = () => {
  return (
    <div 
      className="landing-page" 
      style={{ backgroundImage: `url(${assets.header_img})` }} // Correctly use the URL function
    >
      <div className="landing-page-content">
        <h1>Order your favourite food here</h1>
        <Link
          to="categories-container" // ID of the section you want to scroll to
          smooth={true} // Smooth scrolling effect
          duration={500} // Duration of the scroll in milliseconds
        >
          <button>View Menu</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
