import React, { useEffect, useState } from 'react';
import '../styles/Menu.css';
import { getMenuItems, updateMenuItem, deleteMenuItem, addMenuItem } from '../api';  // Importing updateMenuItem
import { FiEdit, FiTrash2 } from 'react-icons/fi'; // Importing icons
import Modal from './Modal'; // Importing Modal component
import ModalDelete from './ModalDelete';  // Import the modal component
import Notification from './Notification';  // Import the notification component
import ModalAdd from './ModalAdd'; // Import the Modal component

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');  // State for success message

  const [showModaladd, setShowModaladd] = useState(false);
  const [foodItem] = useState({
    name: '',
    price: '',
    category: '',
    subcategory: '',
  });


  useEffect(() => {
    getMenuItems().then((items) => {
      setMenuItems(items);
    });
  }, []);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddMenuItem = async (menuItem) => {
    try {
      const response = await addMenuItem('WafflePondy', menuItem);
      setMenuItems([...menuItems, response.item]); // Add the new item to the list
      setSuccessMessage('Food Item Added Successfully!'); // Set success message
      setShowModaladd(false); // Close the modal after adding the item
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };


  const handleUpdateSubmit = (updatedItem) => {
    updateMenuItem('WafflePondy', updatedItem.unique_id, updatedItem).then(() => {
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
      await deleteMenuItem('WafflePondy', itemToDelete.unique_id);
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
    <div className="menu-container">
      <div className="menu-header">
        <h2>Food List</h2>
        <button onClick={() => setShowModaladd(true)} className="add-button">
          Add Item
        </button>
      </div>
      <div className="menu-list">
        {menuItems.map((item) => (
          <div className="menu-item" key={item.unique_id}>
            <div className="menu-details">
              <img
                src={`data:image/jpeg;base64,/9j/4AAQusrp08mtVlZXTpmKysrK6dP//Z`} // Placeholder for item image
                alt={item.name}
                className="menu-image"
              />
              <div className="menu-info">
                <h3>{item.name}</h3>
                <p>{item.description || "Delicious food item"}</p>
              </div>
            </div>
            <div className="menu-price">
              <span>{item.price} USD</span>
              <div className="menu-actions">
                {/* <button className="edit-button">✏️</button>
                <button className="delete-button">🗑️</button> */}
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
  );
};

export default Menu;
