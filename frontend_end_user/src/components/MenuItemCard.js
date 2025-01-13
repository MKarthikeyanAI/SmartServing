import React, { useState } from "react";
import "../styles/MenuItemCard.css";
import { MdAddCircle, MdRemoveCircle } from "react-icons/md"; // Importing Material Design Icons


const MenuItemCard = ({ item, addToCart, incrementItem, decrementItem, cartItem }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleIncrement = () => {
    incrementItem(item);
  };

  const handleAddToCart = () => {
    addToCart(item);
    setIsAdded(true);
  };

  const handleDecrement = () => {
    decrementItem(item);
    if (cartItem && cartItem.quantity <= 1) {
      setIsAdded(false);
    }
  };

  return (
    <div className="menu-item-card">
      {/* <img src={item.image} alt={item.name} className="food-image" /> */}
      <img src={item.image_url} alt={item.name} className="food-image" />
      <div className="menu-item-info">
        <h3 className="food-name">{item.name}</h3>
        <p className="food-price">₹{item.price}</p>
      </div>
      {isAdded && cartItem ? (
        <div className="cart-controls">
          <button className="decrement-btn" onClick={handleDecrement}>
            <MdRemoveCircle />
          </button>
          <span className="item-count-box">
            {cartItem.quantity}
          </span>
          <button className="increment-btn" onClick={handleIncrement}>
            <MdAddCircle />
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
