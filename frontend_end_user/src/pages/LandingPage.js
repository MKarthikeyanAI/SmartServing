// src/pages/LandingPage.js
import React from 'react';
import Header from '../components/Header'; // Adjust the path if needed
import FooterCompany from '../components/FooterCompany.js';
import LandingPageforCompany from '../components/LandingPageforCompany.js'; // Adjust the path based on your folder structure

const LandingPage = () => {
  return (
    <div>
      <Header />
        <LandingPageforCompany />
      <FooterCompany />
    </div>
  );
};

export default LandingPage;
