import React from "react";
import "./SmartServe.css";

const SmartServe = () => {
  return (
    <section className="smart-serve" data-aos="fade-right">
      <div className="container">
        <div className="content" data-aos="fade-left">
          <h2 data-aos="zoom-in-up" data-aos-delay="200">
            Smart Serve - Revolutionize Your Restaurant
          </h2>
          <p data-aos="zoom-in-up" data-aos-delay="400">
            Smart Serve is our cutting-edge QR code-based menu and ordering
            system designed to streamline operations for restaurants and hotels.
            Enhance customer experience, reduce wait times, and increase
            efficiency with our easy-to-use platform.
          </p>
          <ul data-aos="zoom-in-up" data-aos-delay="600">
            <li>Digital Menus</li>
            <li>Contactless Ordering</li>
            <li>Real-Time Updates</li>
            <li>Customizable Branding</li>
          </ul>
          <button
            className="btn"
            data-aos="zoom-in-up"
            data-aos-delay="800"
            data-aos-offset="200"
          >
            Request a Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default SmartServe;