import React from 'react';
import './CustomWebsite.css';

const CustomWebsite = () => {
  return (
    <section className="custom-website" data-aos="fade-up">
      <div className="container">
        <div className="content" data-aos="fade-left">
          <h2 data-aos="zoom-in-up" data-aos-delay="200">
            Custom Website Development
          </h2>
          <p data-aos="zoom-in-up" data-aos-delay="400">
            Need a unique online presence? We build custom websites tailored to
            your specific needs and goals. Our team of expert developers will
            work with you to create a stunning, responsive, and high-performing
            website that reflects your brand and drives results.
          </p>
          <ul data-aos="zoom-in-up" data-aos-delay="600">
            <li>E-commerce Solutions</li>
            <li>Responsive Design</li>
            <li>SEO Optimization</li>
            <li>Content Management Systems</li>
          </ul>
          <button
            className="btn"
            data-aos="zoom-in-up"
            data-aos-delay="800"
            data-aos-offset="200"
          >
            Get a Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomWebsite;
