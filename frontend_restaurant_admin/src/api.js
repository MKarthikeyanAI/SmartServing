import axios from 'axios';
const API_URL = 'http://localhost:5000';

// const API_URL = 'https://sx935z96s4.execute-api.ap-south-1.amazonaws.com';

export const getMenuItems = async () => {
  const response = await fetch(`${API_URL}/get-menu-items/WafflePondy`);
  const data = await response.json();

  // Ensure that only the necessary fields are returned, and adjust the response structure
  return data.menu_items.map((item) => ({
    unique_id: item.unique_id,
    name: item.name,
    price: item.price,
    category: item.category,
    image_url: item.image_url,  // Include the image_url
  }));
};

export const getOrders = async (restaurantName) => {
  try {
    const response = await axios.get(`${API_URL}/get-orders/${restaurantName}`);
    console.log(response);
    console.log(response.data.orders);
    return response.data.orders;

  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const updateOrderStatus = async (restaurantName, orderId, status) => {
  try {
    const response = await axios.post(`${API_URL}/update-order-status/${restaurantName}/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

export const getProcessingOrders = async (restaurantName) => {
  try {
    const response = await axios.get(`${API_URL}/get-processing-orders/${restaurantName}`);
    return response.data.orders;
  } catch (error) {
    console.error("Error fetching processing orders:", error);
    return [];
  }
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

// export const addMenuItem = async (restaurantName, menuItem) => {
//   try {
//     const response = await axios.post(`${API_URL}/add-menu-item/${restaurantName}`, menuItem);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
export const addMenuItem = async (restaurantName, menuItem) => {
  try {
    const response = await axios.post(`${API_URL}/add-menu-item/${restaurantName}`, menuItem);
    return response.data;
  } catch (error) {
    throw error;
  }
};


