import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewRestaurantDetails from './components/ViewRestaurantDetails';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        {!isLoggedIn ? (
          <Login onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <Routes>
            {/* Route for the Dashboard page */}
            <Route path="/all_restaurants" element={<Dashboard onLogout={handleLogout} />} />
            {/* Route for viewing restaurant details */}
            <Route path="/:restaurantName" element={<ViewRestaurantDetails />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
