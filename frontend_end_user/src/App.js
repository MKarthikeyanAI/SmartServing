import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import LandingPage from "./pages/LandingPage"; // Import LandingPage

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.unique_id === item.unique_id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.unique_id === item.unique_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const incrementItem = (item) => {
    setCart(
      cart.map((cartItem) =>
        cartItem.unique_id === item.unique_id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  const decrementItem = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.unique_id === item.unique_id);
    if (existingItem.quantity === 1) {
      setCart(cart.filter((cartItem) => cartItem.unique_id !== item.unique_id));
    } else {
      setCart(
        cart.map((cartItem) =>
          cartItem.unique_id === item.unique_id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
  };


  const removeItem = (itemId) => {
    setCart(cart.filter((cartItem) => cartItem.unique_id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} /> {/* Default landing page route */}
        {/* <Route path="/:restaurantName/menu_items/:tableName" element={<MenuPage />} /> */}
        <Route
          path="/WafflePondy/menu_items/table1"
          element={
            <MenuPage 
              addToCart={addToCart} 
              cart={cart} 
              incrementItem={incrementItem} 
              decrementItem={decrementItem} 
            />
          }
        />
        <Route
          path="/order-confirmation/:restaurantName/:tableName"
          element={
            <OrderConfirmationPage
              cart={cart}
              incrementItem={incrementItem}
              decrementItem={decrementItem}
              removeItem={removeItem}
              clearCart={clearCart}
            />
          }
        />
        <Route path="/:restaurantName/my-orders/:userId" element={<MyOrdersPage />} />
        {/* <Route path="/:restaurantName/my-orders/:userId/:tableName" element={<MyOrdersPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
