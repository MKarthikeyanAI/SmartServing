import React from 'react';
import AdminPanel from './pages/AdminPanel';


function App() {
  const restaurantName = 'WafflePondy'; // Set the restaurant name
  return (
    <div className="App">
      <AdminPanel restaurantName={restaurantName} />
    </div>
  );
}

export default App;
