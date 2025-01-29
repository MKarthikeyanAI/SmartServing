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
import { FiSearch } from "react-icons/fi";
import { RiShoppingCartLine } from "react-icons/ri";
import { FaHome, FaUtensils, FaEnvelope } from "react-icons/fa";

const MenuPages = ({ addToCart, cart, incrementItem, decrementItem }) => {
  const { restaurantName, tableName } = useParams();

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    if (!tableName) {
      navigate('/service-unavailable');
    } else {
      navigate(`/order-confirmation/${restaurantName}`);
    }
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
        <div className="nav-links-21">
        
        <div className="search-container"> 
            {!isSearchOpen && (
              <FiSearch
                className="search-icon"
                onClick={() => {
                  setIsSearchOpen(true); 
                  const categoriesContainer = document.getElementById("categories-container-1");
                  if (categoriesContainer) {
                    categoriesContainer.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            )}
            {isSearchOpen && (
              <input
                type="text"
                placeholder="Search your food"
                value={searchTerm}
                onChange={handleSearch}
                onBlur={() => setIsSearchOpen(false)} 
                className="search-input"
              />
            )}
          </div>
         {/* Home Icon */}
         <Link
            to="menu-page"
            smooth={true}
            duration={500}
            className="nav-link"
            title="Home" // Tooltip for accessibility
          >
            <FaHome className="nav-icon" />
          </Link>
        
          {/* Menu Icon */}
          <Link
            to="categories-container-1"
            smooth={true}
            duration={500}
            className="nav-link"
            title="Menu" // Tooltip for accessibility
          >
            <FaUtensils className="nav-icon" />
          </Link>
        
          {/* Contact Icon */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              navigateToContact();
            }}
            className="nav-link"
            title="Contact Us" // Tooltip for accessibility
          >
            <FaEnvelope className="nav-icon" />
          </a>
            {/* My Orders Icon */}
            <div className="nav-link" onClick={navigateToOrders} title="My Orders"> 
            <RiFileList2Line className="nav-icon" />
          </div>
        
          {/* Go to Cart Icon */}
          <div className="nav-link" onClick={navigateToCart} title="Go to Cart">
            <RiShoppingCartLine className="nav-icon" />
          </div>
        
          <div className="nav-link"> 
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
          
          </div>
        
        <div className="cart-summary-1">
          {modalOpen && (
            <ModalUserDetailslogin
              onClose={() => setModalOpen(false)}
              onSubmit={handleModalSubmit}
            />
          )}
           
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
      <div className="menu-container-1">
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
