import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMenuItems,getUserId,addUser } from "../api/api";
import MenuItemCard from "../components/MenuItemCard";
import { RiFileList2Line } from 'react-icons/ri';
import ModalUserDetailslogin from "../components/ModalUserDetailslogin";
import "../styles/MenuPage.css";

const MenuPage = ({ addToCart, cart, incrementItem, decrementItem }) => {

  // const { restaurantName, tableName } = useParams(); for dynamic

  const restaurantName = "WafflePondy"; // Static test value
  const tableName = "table1"; // Static test value

  const navigate = useNavigate();

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
    navigate(`/order-confirmation/${restaurantName}/${tableName}`);
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
    console.log("After successful login: ",userId);
    console.log(userId);
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
    <div className="menu-page">
      <div className="navbar">
        <input
          type="text"
          placeholder="Search your food"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="cart-summary">

        {modalOpen && (
        <ModalUserDetailslogin
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
          <span>Total: ₹{calculateTotal().toFixed(2)}</span>
          <span>Items: {cart.length}</span>

          {/* My Orders button with icon */}
          <button onClick={navigateToOrders} className="orders-button">
          <RiFileList2Line /> My Orders
          </button>


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
              key={item.unique_id}
              item={item}
              cartItem={cart.find((cartItem) => cartItem.unique_id === item.unique_id)}
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