import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 data-aos="fade-down">
            Empowering Businesses with Innovative Software Solutions
          </h1>
          <p data-aos="fade-up" data-aos-delay="300">
            Lyka Software offers Smart Serve, a QR code-based menu and ordering
            system, and custom website development to help your business thrive
            in the digital age.
          </p>
          <button className="btn" data-aos="fade-up" data-aos-delay="500">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;