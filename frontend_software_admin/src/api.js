import axios from 'axios';

const API_URL = "http://localhost:5000";


export const getRestaurants = () => axios.get(`${API_URL}/get-restaurants`);
export const getRestaurantDetails = (restaurantName) => axios.get(`${API_URL}/get-restaurant-details/${restaurantName}`);
export const createRestaurant = (data) => axios.post(`${API_URL}/create-restaurant`, data);

export const addMenuItem = async (restaurantName, menuItem) => {
    try {
      const response = await axios.post(`${API_URL}/add-menu-item/${restaurantName}`, menuItem);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
export const getMenuItems = (restaurantName) => axios.get(`${API_URL}/get-menu-items/${restaurantName}`);

export const updateMenuItem = async (restaurantName, itemId, menuItem) => {
  try {
      const response = await axios.put(`${API_URL}/update-menu-item/${restaurantName}/${itemId}`, menuItem);
      return response.data;
  } catch (error) {
      throw error;
  }
};

export const deleteMenuItem = (restaurantName, itemId) =>
    axios.delete(`${API_URL}/delete-menu-item/${restaurantName}/${itemId}`);

// API function to create QR code and store it
export const createQRCodeScanner = async (restaurantName, qrData) => {
  try {
    const response = await axios.post(`${API_URL}/create-qrcode-scanner/${restaurantName}`, qrData);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error creating QR code:', error);
    throw error;
  }
};


export const getQRCodeScanners = async (restaurantName) => {
  try {
    const response = await axios.get(`${API_URL}/qrcodes/${restaurantName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    throw error;
  }
};


export const deleteQRCodeByTableName = async (restaurantName, tableName) => {
  try {
    const response = await axios.delete(`${API_URL}/qrcodes/${restaurantName}/${tableName}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting QR code:', error);
    throw error;
  }
};