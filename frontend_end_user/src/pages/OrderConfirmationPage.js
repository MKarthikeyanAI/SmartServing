import React, { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import "../styles/OrderConfirmationPage.css";
import { placeOrder, getUserId } from "../api/api";
import ModalUserDetails from "../components/ModalUserDetails";  // Import the Modal component

const OrderConfirmationPage = ({ cart, incrementItem, decrementItem, removeItem,clearCart }) => {
  const { restaurantName, tableName } = useParams(); // Extracting restaurantName and tableName from route parameters
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [mobileNumber, setMobileNumber] = useState(localStorage.getItem("mobileNumber") || "");

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {

    if (!username || !mobileNumber) {
      setShowModal(true); // Show modal if user details are missing
      return;
    }

    const orderData = {
      restaurant_name: restaurantName,
      table_name: tableName, // Include the table name in the order data
      username,
      mobile_number: mobileNumber,
      order_details: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };


    try {
      const response = await placeOrder(restaurantName, orderData);
      alert(response.message);
      clearCart(); // Clear the cart after order placement


      // Retrieve the user ID
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
    setShowModal(false); // Hide modal after collecting user details
    handlePlaceOrder(); // Proceed to place the order
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <img
            src="path_to_your_empty_cart_image.gif"
            alt="Your cart is empty"
            className="empty-cart-image"
          />
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.unique_id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <span>₹{item.price}</span>
                  <div className="cart-item-controls">
                    <button onClick={() => decrementItem(item)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => incrementItem(item)}>+</button>
                  </div>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => removeItem(item.unique_id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Total: ₹{calculateTotal().toFixed(2)}</h2>
            <button onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </>
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
