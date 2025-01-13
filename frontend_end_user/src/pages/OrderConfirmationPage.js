// OrderConfirmationPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/OrderConfirmationPage.css";
import { placeOrder, getUserId } from "../api/api";
import ModalUserDetails from "../components/ModalUserDetails";

const OrderConfirmationPage = ({ cart, incrementItem, decrementItem, removeItem, clearCart }) => {
  const { restaurantName, tableName } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [mobileNumber, setMobileNumber] = useState(localStorage.getItem("mobileNumber") || "");
  const [categories, setCategories] = useState([]); 
  const [activeCategory, setActiveCategory] = useState("All"); 

  useEffect(() => {
    // Fetch categories from your API or data source
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories/${restaurantName}`); // Replace with your API endpoint
        const data = await response.json();
        setCategories(["All", ...data]); // Add "All" category at the beginning
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [restaurantName]);

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!username || !mobileNumber) {
      setShowModal(true);
      return;
    }

    const orderData = {
      restaurant_name: restaurantName,
      table_name: tableName,
      username,
      mobile_number: mobileNumber,
      order_details: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const response = await placeOrder(restaurantName, orderData);
      alert(response.message);
      clearCart();

      const userId = await getUserId(restaurantName, username, mobileNumber);
      if (userId) {
        navigate(`/${restaurantName}/my-orders/${userId}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order.");
    }
  };

  const handleSubmitForm = (formData) => {
    if (!formData.username || !formData.mobileNumber) {
      alert("Please fill in your name and mobile number");
      return;
    }

    localStorage.setItem("username", formData.username);
    localStorage.setItem("mobileNumber", formData.mobileNumber);
    setUsername(formData.username);
    setMobileNumber(formData.mobileNumber);
    setShowModal(false);
    handlePlaceOrder();
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const filteredCart = activeCategory === "All"
    ? cart
    : cart.filter((item) => item.category === activeCategory);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {/* Categories Section */}
      <div className="categories-container">
        <ul className="categories-list">
          {categories.map((category) => (
            <li
              key={category}
              className={`category-item ${activeCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {filteredCart.length === 0 ? (
        <div className="empty-cart">
          <img
            src="path_to_your_empty_cart_image.gif" 
            alt="Your cart is empty"
            className="empty-cart-image"
          />
          <p>Your cart is empty</p>
        </div>
      ) : (
        <div className="cart-items">
          {filteredCart.map((item) => (
            <div key={item.unique_id} className="cart-item">
              {/* Image on the left */}
              <img src={item.image_url} alt={item.name} className="cart-item-image" />

              {/* Item details in the center */}
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <div className="cart-item-controls">
                  <button onClick={() => decrementItem(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => incrementItem(item)}>+</button>
                </div>
                <span>₹{item.price}</span> {/* Price below quantity */}
                <button
                  className="remove-item-btn"
                  onClick={() => removeItem(item.unique_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Cart summary at the bottom */}
          <div className="cart-summary">
            <h2>Total: ₹{calculateTotal().toFixed(2)}</h2>
            <button onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </div>
      )}

      {showModal && (
        <ModalUserDetails
          username={username}
          mobileNumber={mobileNumber}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitForm}
        />
      )}
    </div>
  );
};

export default OrderConfirmationPage;