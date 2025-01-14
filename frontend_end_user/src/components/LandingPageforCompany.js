import React from 'react';
import '../styles/LandingPageforCompany.css'; // Import the CSS file
import { assets } from "../assets/assets.js";

const LandingPageforCompany = () => {
  return (
      <div 
        className="landing-page" 
        style={{ backgroundImage: `url(${assets.background_image})` }} // Correctly use the URL function
      >
        <div className="landing-page-content">
          <h1>All Restaurants at One Place</h1>
        </div>
      </div>
  
  );
};

export default LandingPageforCompany;
