import axios from 'axios';
const API_URL = 'http://localhost:5000';

export const getMenuItems = async () => {
  const response = await fetch(`${API_URL}/get-menu-items/WafflePondy`);
  const data = await response.json();

  // Ensure that only the necessary fields are returned, and adjust the response structure
  return data.menu_items.map((item) => ({
    unique_id: item.unique_id,
    name: item.name,
    price: item.price,
    category: item.category,
    subcategory: item.subcategory,
  }));
};


export const updateMenuItem = async (restaurantName, itemId, menuItem) => {
  try {
    const response = await axios.put(
      `${API_URL}/update-menu-item/${restaurantName}/${itemId}`,
      menuItem
    );
    return response.data;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};


export const deleteMenuItem = (restaurantName, itemId) => {
  return axios.delete(`${API_URL}/delete-menu-item/${restaurantName}/${itemId}`);
};

export const addMenuItem = async (restaurantName, menuItem) => {
  try {
    const response = await axios.post(`${API_URL}/add-menu-item/${restaurantName}`, menuItem);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrders = async () => {
  const response = await fetch(`${API_URL}/get-orders/WafflePondy`);
  const data = await response.json();
  return data.orders;
};
