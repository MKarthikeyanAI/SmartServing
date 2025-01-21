import React, { useState } from "react";
import "../styles/MenuItemCard.css";
// import { MdAddCircle, MdRemoveCircle } from "react-icons/md"; 
import { assets } from '../assets/assets.js'

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
      <img src={item.image_url} alt={item.name} className="food-image" />
      <div className="menu-item-info">
        <h3 className="food-name">{item.name}</h3>
        <div className="price-add-wrapper">
          <p className="food-price">₹{item.price}</p>
          {isAdded && cartItem ? (
            <div className="cart-controls">
              <button className="decrement-btn" onClick={handleDecrement}>
                <img src={assets.remove_icon_red} alt="Remove" />
              </button>
              <span className="item-count-box">
                {cartItem.quantity}
              </span>
              <button className="increment-btn" onClick={handleIncrement}>
                <img src={assets.add_icon_green} alt="Add" />
              </button>
            </div>
          ) : (
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              ADD +
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;