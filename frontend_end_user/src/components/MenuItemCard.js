import React, { useState } from "react";
import "../styles/MenuItemCard.css";

const MenuItemCard = ({ item, addToCart, incrementItem, decrementItem, cartItem }) => {
  const [isAdded, setIsAdded] = useState(false); // Local state for each card

  const handleAddToCart = () => {
    addToCart(item);
    setIsAdded(true); // Show increment/decrement controls
  };

  const handleDecrement = () => {
    decrementItem(item);
    if (cartItem && cartItem.quantity <= 1) {
      setIsAdded(false); // Hide increment/decrement controls when quantity is 0
    }
  };

  return (
    <div className="menu-item-card">
      <img src={item.image} alt={item.name} className="food-image" />
      <div className="menu-item-info">
        <h3 className="food-name">{item.name}</h3>
        <p className="food-price">₹{item.price}</p>
      </div>
      {isAdded && cartItem ? (
        <div className="cart-controls">
          <button className="decrement-btn" onClick={handleDecrement}>
            -
          </button>
          <span className="item-count">{cartItem.quantity}</span>
          <button className="increment-btn" onClick={() => incrementItem(item)}>
            +
          </button>
        </div>
      ) : (
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default MenuItemCard;
