import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact" data-aos="fade-up">
      <div className="container">
        <h2 data-aos="fade-up" data-aos-delay="200">
          Contact Us
        </h2>
        <p data-aos="fade-up" data-aos-delay="400">
          Ready to discuss your project or learn more about our services? Fill
          out the form below, and we'll get back to you as soon as possible.
        </p>
        <form data-aos="fade-up" data-aos-delay="600">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button className="btn" type="submit">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;