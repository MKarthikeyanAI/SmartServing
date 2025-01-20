import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMenuItems, getUserId, addUser } from "../api/api";
import MenuItemCard from "../components/MenuItemCard";
import { RiFileList2Line } from 'react-icons/ri';
import ModalUserDetailslogin from "../components/ModalUserDetailslogin";
import "../styles/MenuPages.css";
import { assets } from '../assets/assets.js'
import Footer from "../components/Footer.js";
import LandingPage from '../components/LandingPage.js';
import { Link } from "react-scroll";

const MenuPages = ({ addToCart, cart, incrementItem, decrementItem }) => {
  const { restaurantName } = useParams();

  const navigate = useNavigate();
  const footerRef = useRef(null);

  const navigateToContact = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

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

  const navigateToCart = () => {
    navigate(`/order-confirmation/${restaurantName}`);
  };

  const navigateToOrders = async () => {
    const username = localStorage.getItem("username");
    const mobileNumber = localStorage.getItem("mobileNumber");

    if (!username || !mobileNumber) {
      setModalOpen(true);
      return;
    }

    try {
      const userId = await getUserId(restaurantName, username, mobileNumber);
      if (userId) {
        navigate(`/${restaurantName}/my-orders/${userId}`);
      }
    } catch (error) {
      console.error("Error navigating to orders:", error.message);
      alert("Failed to retrieve user ID.");
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      const { username, mobileNumber } = formData;
      await addUser(restaurantName, username, mobileNumber);
      localStorage.setItem("username", username);
      localStorage.setItem("mobileNumber", mobileNumber);
      setModalOpen(false);
      navigateToOrders();
    } catch (error) {
      console.error("Error adding user:", error.message);
      alert("Failed to add user.");
    }
  };

  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="menu-page" id="menu-page">
      <div className="navbar-1">
        <div className="logo-container-1">
          <img src={assets.logo} alt="Logo" className="logo-1" />
        </div>
        <div className="search-container-1">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input-1"
          />
        </div>
        <div className="nav-links-1">
          <Link
            to="menu-page"
            smooth={true}
            duration={500}
            className="nav-link-1"
          >
            Home
          </Link>
          <Link
            to="categories-container-1"
            smooth={true}
            duration={500}
            className="nav-link-1"
          >
            Menu
          </Link>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              navigateToContact();
            }}
            className="nav-link-1"
          >
            Contact Us
          </a>
        </div>
        <div className="cart-summary-1">
          {modalOpen && (
            <ModalUserDetailslogin
              onClose={() => setModalOpen(false)}
              onSubmit={handleModalSubmit}
            />
          )}
            <span>Total: ₹{calculateTotal().toFixed(2)}</span>
            <span>Items: {cart.length}</span>
          <button onClick={navigateToOrders} className="orders-button-1">
            <RiFileList2Line /> My Orders
          </button>
          <button onClick={navigateToCart} className="cart-button-1">Go to Cart</button>
        </div>
      </div>
      
      <LandingPage />
      
      <div className="categories-container-1" id="categories-container-1">
        <div className="categories-scroll">
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
      </div>
      <div className="menu-container">
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.unique_id}
            item={item}
            cartItem={cart.find((cartItem) => cartItem.unique_id === item.unique_id)}
            addToCart={addToCart}
            incrementItem={incrementItem}
            decrementItem={decrementItem}
          />
        ))}
      </div>
      <Footer ref={footerRef} />
    </div>
  );
};

export default MenuPages;
