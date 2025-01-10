import React from "react";
import "../styles/OrderConfirmationPage.css";

const OrderConfirmationPage = ({ cart, incrementItem, decrementItem, removeItem }) => {
  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    console.log("Order placed with the following items:");
    cart.forEach((item) => {
      console.log(`Name: ${item.name}, Quantity: ${item.quantity}, Price: ₹${item.price}`);
    });
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.unique_id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              {/* <p>{item.description}</p> */}
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
        <button onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
