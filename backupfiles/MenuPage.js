// // Extract restaurantName and tableName from the URL
// //   const { restaurantName, tableName } = useParams();
// const restaurantName = "WafflePondy"; // Static test value
// const tableName = "table1"; // Static test value
// // Inside your component
// const navigate = useNavigate();
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMenuItems } from "../api/api";
import MenuItemCard from "../components/MenuItemCard";
import "../styles/MenuPage.css";

const MenuPage = () => {

  // // Extract restaurantName and tableName from the URL
// //   const { restaurantName, tableName } = useParams();

  const restaurantName = "WafflePondy"; // Static test value
  const tableName = "table1"; // Static test value
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      const items = await getMenuItems(restaurantName);
      setMenuItems(items);
      setFilteredItems(items);
      const uniqueCategories = ["All", ...new Set(items.map((item) => item.category))];
      setCategories(uniqueCategories);
    };
    fetchMenuItems();
  }, [restaurantName]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter((item) => item.category === category));
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredItems(
      menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term)
      )
    );
  };

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const incrementItem = (item) => {
    setCart(
      cart.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      )
    );
  };

  const decrementItem = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem.quantity === 1) {
      setCart(cart.filter((cartItem) => cartItem.id !== item.id));
    } else {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        )
      );
    }
  };

  const navigateToCart = () => {
    navigate(`/order-confirmation/${restaurantName}/${tableName}`, { state: { cart } });
  };


  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="menu-page">
      <div className="navbar">
        <input
          type="text"
          placeholder="Search your food"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="cart-summary">
          <span>Total: ₹{calculateTotal().toFixed(2)}</span>
          <span>Items: {cart.length}</span>
          <button onClick={navigateToCart}>Go to Cart</button>
        </div>
      </div>

      <div className="main-content">
        <div className="sidebar">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${category === activeCategory ? "active" : ""}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="menu-container">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              cartItem={cart.find((cartItem) => cartItem.id === item.id)} // Pass specific cart item
              addToCart={addToCart}
              incrementItem={incrementItem}
              decrementItem={decrementItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
