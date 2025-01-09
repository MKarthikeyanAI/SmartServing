import React, { useState } from 'react';
import { createRestaurant } from '../api';
import '../styles/CreateRestaurant.css';

const CreateRestaurant = ({ onRestaurantCreated ,onClose}) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const response = await createRestaurant({ restaurant_name: restaurantName, username, password });
      await createRestaurant({ restaurant_name: restaurantName, username, password });
      setShowSuccessMessage(true); // Show success message
      setTimeout(() => setShowSuccessMessage(false), 3000); // Hide the success message after 3 seconds
      onRestaurantCreated(); // Trigger the parent component to refresh restaurant list
      onClose(); // Close the modal after restaurant is created
    } catch (error) {
      alert('Error creating restaurant');
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-box">
        <h2>Create Restaurant</h2>
        {showSuccessMessage && (
          <div className="success-message">
            <p>Restaurant Created Successfully!</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Restaurant Name</label>
            <input
              type="text"
              placeholder="Enter restaurant name"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button type="submit">Create</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurant;
