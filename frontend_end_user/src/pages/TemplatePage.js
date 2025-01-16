import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import AboutUs from '../components/AboutUs/AboutUs';
import SmartServe from '../components/SmartServe/SmartServe';
import CustomWebsite from '../components/CustomWebsite/CustomWebsite';
import Testimonials from '../components/Testimonials/Testimonials';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

function TemplatePage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <div data-aos="fade-up"><SmartServe /></div>
            <div data-aos="fade-up"><CustomWebsite /></div>
            <div data-aos="fade-up"><Testimonials /></div>
            <div data-aos="fade-up"><AboutUs /></div>
            <div data-aos="fade-up"><Contact /></div>
          </>
        } />
        {/* Define other routes if needed */}
      </Routes>
      <Footer />
    </div>
  );
}

export default TemplatePage;
