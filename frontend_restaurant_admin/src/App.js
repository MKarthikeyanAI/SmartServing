import React, { useState } from 'react';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';


function App() {
  const [restaurantName, setRestaurantName] = useState(null);

  const handleLoginSuccess = (restaurantName) => {
    setRestaurantName(restaurantName);
  };

   return (
    <div className="App">
      {restaurantName ? (
        <AdminPanel restaurantName={restaurantName} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
