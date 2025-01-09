import React, { useEffect, useState } from 'react';
import { getRestaurants } from '../api';
import CreateRestaurant from './CreateRestaurant';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';  // Import the CSS file

const Dashboard = ({ onLogout }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await getRestaurants();
        setRestaurants(response.data.restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);


  // Function to trigger re-fetch of restaurants
  const handleRestaurantCreated = () => {
    const fetchRestaurants = async () => {
      try {
        const response = await getRestaurants();
        setRestaurants(response.data.restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  };


  const viewDetails = (restaurantName) => {
    navigate(`/${restaurantName}`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-actions">
          {/* <button className="create-restaurant-btn" onClick={() => setShowCreateForm(true)}>Create Restaurant</button>
           */}
          <button className="create-restaurant-btn" onClick={() => setShowCreateForm(true)}>
            Create Restaurant
          </button>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Create Restaurant Form Modal
      {showCreateForm && (
        <CreateRestaurant
          onClose={() => setShowCreateForm(false)}  // Close modal when user cancels or after success
          onSuccess={() => {
            // After success, reload the list of restaurants
            setShowCreateForm(false); // Close modal
            window.location.reload();  // Reload the page to reflect changes
          }}
        />
      )} */}
      {showCreateForm && (
        <CreateRestaurant onRestaurantCreated={handleRestaurantCreated} onClose={() => setShowCreateForm(false)} />
      )}

      <div className="restaurants-table-container">
        <table className="restaurants-table">
          <thead>
            <tr>
              <th>Restaurant Name</th>
              <th>More Details</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant, index) => (
              <tr key={index}>
                <td>{restaurant}</td>
                <td>
                  <button className="view-details-btn" onClick={() => viewDetails(restaurant)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
