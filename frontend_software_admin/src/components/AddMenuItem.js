import React, { useState } from 'react';
import { addMenuItem, updateMenuItem } from '../api';  // Adjust path if needed
import '../styles/AddMenuItem.css';  // Import the CSS file

const AddMenuItem = ({ restaurantName, onItemAdded, itemToUpdate }) => {
  const [name, setName] = useState(itemToUpdate ? itemToUpdate.name : '');
  const [price, setPrice] = useState(itemToUpdate ? itemToUpdate.price : '');
  const [category, setCategory] = useState(itemToUpdate ? itemToUpdate.category : '');
  // const [subcategory, setSubcategory] = useState(itemToUpdate ? itemToUpdate.subcategory : '');
  const [imageUrl, setImageUrl] = useState(itemToUpdate ? itemToUpdate.image_url : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!name || !price || !category || !imageUrl) {
      alert("Please fill in all fields!");
      return;
    }

    // Ensure the price is a valid number
    if (isNaN(price) || parseFloat(price) <= 0) {
      alert("Please enter a valid price!");
      return;
    }

    const menuItem = {
      name,
      price: parseFloat(price),
      category,
      image_url: imageUrl,
    };

    try {
      // Call API to add or update menu item
      if (itemToUpdate) {
        await updateMenuItem(restaurantName, itemToUpdate._id, menuItem);
      } else {
        await addMenuItem(restaurantName, menuItem);
      }

      alert('Food item added/updated successfully!');
      setName('');
      setPrice('');
      setCategory('');
      setImageUrl('');
      onItemAdded(); // Callback to refresh the menu items list in the parent component
    } catch (error) {
      alert('Error adding/updating menu item');
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h3>{itemToUpdate ? 'Update' : 'Add'} Food Item</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Food Item Name</label>
            <input
              type="text"
              placeholder="Enter food item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Price</label>
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Category</label>
            <input
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="input-group">
          <label>Image URL</label>
            <input
              type="text"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <button type="submit">{itemToUpdate ? 'Update' : 'Add'} Item</button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
