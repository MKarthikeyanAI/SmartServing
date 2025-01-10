import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";

function App() {
  return (
    <Router>
      <Routes>
      {/* <Route path="/:restaurantName/menu_items/:tableName" element={<MenuPage />} /> */}
      <Route path="/WafflePondy/menu_items/table1" element={<MenuPage />} />
      <Route path="/order-confirmation/:restaurantName/:tableName" element={<OrderConfirmationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
