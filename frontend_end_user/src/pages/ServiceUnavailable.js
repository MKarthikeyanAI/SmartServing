// src/pages/ServiceUnavailable.js
import React from 'react';
import '../styles/ServiceUnavailable.css';
import { useNavigate } from 'react-router-dom';

const ServiceUnavailable = () => {
  const navigate = useNavigate();

  return (
    <div className="service-unavailable">
      <h1>Service Unavailable</h1>
      <p>This service is not available in this store.</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default ServiceUnavailable;
