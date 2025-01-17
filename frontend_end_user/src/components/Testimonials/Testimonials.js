import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  return (
    <section className="testimonials" data-aos="fade-up">
      <div className="container">
        <h2 data-aos="fade-up" data-aos-delay="200">
          What Our Clients Say
        </h2>
        <div className="testimonial-slider">
          <div className="testimonial" data-aos="zoom-in" data-aos-delay="400">
            <p>
              "Lyka Software transformed our restaurant with Smart Serve. Our
              customers love the convenience, and our staff is more efficient
              than ever!"
            </p>
            <p className="author">- John Doe, Restaurant Owner</p>
          </div>
          <div className="testimonial" data-aos="zoom-in" data-aos-delay="600">
            <p>
              "The custom website they built for us perfectly captures our brand
              and has significantly increased our online inquiries."
            </p>
            <p className="author">- Jane Smith, Business Owner</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;