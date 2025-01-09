import axios from 'axios';

const BASE_URL = "http://localhost:5000";

export const getMenuItems = async (restaurantName) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-menu-items/${restaurantName}`);
    return response.data.menu_items;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
};

export const placeOrder = async (restaurantName, tableName, order) => {
  try {
    const response = await axios.post(`${BASE_URL}/place-order`, {
      restaurant_name: restaurantName,
      table_name: tableName,
      order,
    });
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
  }
};
