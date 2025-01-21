import React, { useEffect, useState } from 'react';
import '../styles/Menu.css';
import { getMenuItems, updateMenuItem, deleteMenuItem, addMenuItem, updateMenuItemStock } from '../api';  // Importing updateMenuItem
import { FiEdit, FiTrash2 } from 'react-icons/fi'; // Importing icons
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Importing ThemeProvider and theme creation
import { Switch } from '@mui/material'; // Use Material-UI Switch for toggle
import Modal from './Modal'; // Importing Modal component
import ModalDelete from './ModalDelete';  // Import the modal component
import Notification from './Notification';  // Import the notification component
import ModalAdd from './ModalAdd'; // Import the Modal component
import { ClipLoader } from 'react-spinners'; // Import ClipLoader

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize the primary color
    },
    secondary: {
      main: '#dc004e', // Customize the secondary color
    },
  },
});


const Menu = ({restaurantName}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');  // State for success message
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const [showModaladd, setShowModaladd] = useState(false);
  const [foodItem] = useState({
    name: '',
    price: '',
    category: '',
    image_url: '',
    stock: ''
  });


  useEffect(() => {
    if (restaurantName) {
      getMenuItems(restaurantName)
        .then((items) => {
          setMenuItems(items);
          setIsLoading(false); // Stop loading once items are fetched
        })
        .catch(() => setIsLoading(false)); // Stop loading even if there's an error
    }
  }, [restaurantName]); // Dependency on restaurantName

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };


  const handleStockToggle = async (item) => {
    const updatedStock = item.stock === 'yes' ? 'no' : 'yes';
  
    try {
      const response = await updateMenuItemStock(restaurantName, item.unique_id, { ...item, stock: updatedStock });
      console.log('API Response:', response);
  
      setMenuItems((prevItems) =>
        prevItems.map((menuItem) =>
          menuItem.unique_id === item.unique_id ? { ...menuItem, stock: updatedStock } : menuItem
        )
      );
  
      setSuccessMessage(`Stock status updated to ${updatedStock === 'yes' ? 'In Stock' : 'Out of Stock'}`);
    } catch (error) {
      console.error('Error updating stock status:', error);
      setSuccessMessage('Failed to update stock status. Please try again.');
    }
  };
  
  

  const handleAddMenuItem = async (menuItem) => {
    try {
      const response = await addMenuItem(restaurantName, menuItem);
      setMenuItems([...menuItems, response.item]); // Add the new item to the list
      setSuccessMessage('Food Item Added Successfully!'); // Set success message
      setShowModaladd(false); // Close the modal after adding the item
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };


  const handleUpdateSubmit = (updatedItem) => {
    updateMenuItem(restaurantName, updatedItem.unique_id, updatedItem).then(() => {
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.unique_id === updatedItem.unique_id ? updatedItem : item
        )
      );
      setIsModalOpen(false);
    });
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowModal(true);  // Show modal for confirmation
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMenuItem(restaurantName, itemToDelete.unique_id);
      setMenuItems(menuItems.filter((item) => item.unique_id !== itemToDelete.unique_id)); // Remove deleted item from UI
      setSuccessMessage('Deleted Successfully!'); // Set success message
      setShowModal(false); // Close modal
    } catch (error) {
      console.error('Error deleting food item:', error);
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal if the user cancels
  };

  return (
    <ThemeProvider theme={theme}>
 <div className="menu-container">
      <div className="menu-header">
        <h2>Food List</h2>
        <button onClick={() => setShowModaladd(true)} className="add-button">
          Add Item
        </button>
      </div>
      {isLoading ? (
          <div className="spinner-container-1">
            <ClipLoader size={50} color="#1976d2" />
          </div>
        ) : (
          <div className="menu-list">
            {menuItems.map((item) => (
              <div className={`menu-item ${item.stock === 'yes' ? 'in-stock' : 'out-of-stock'}`} key={item.unique_id}>
                <div className="menu-details">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="menu-image"
                  />
                  <div className="menu-info">
                    <h3>{item.name}</h3>
                    <p>{item.description || "Delicious food item"}</p>
                    <p><strong>Stock:</strong> {item.stock === 'yes' ? 'In Stock' : 'Out of Stock'}</p>
                  </div>
                </div>
                <div className="menu-price">
                  <span>{item.price} INR</span>
                  <Switch
                    checked={item.stock === 'yes'}
                    onChange={() => handleStockToggle(item)}
                    color="primary"
                  />
                  <div className="menu-actions">
                    <button
                      className="icon-button edit-button"
                      onClick={() => handleEditClick(item)}
                    >
                      <FiEdit />
                    </button>
                    <button className="icon-button delete-button" onClick={() => handleDeleteClick(item)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {isModalOpen && (
        <Modal
          item={selectedItem}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleUpdateSubmit}
        />
      )}

{showModal && (
        <ModalDelete 
          message="Are you sure you want to delete this item?" 
          onClose={handleCloseModal} 
          onConfirm={handleDeleteConfirm} 
        />
      )}

{showModaladd && (
        <ModalAdd
          item={foodItem}
          onClose={() => setShowModaladd(false)}
          onSubmit={handleAddMenuItem}
        />
      )}

      {/* Display success message as notification */}
      {successMessage && <Notification message={successMessage} onClose={() => setSuccessMessage('')} />}
    </div>
    </ThemeProvider>
   
  );
};

export default Menu;
