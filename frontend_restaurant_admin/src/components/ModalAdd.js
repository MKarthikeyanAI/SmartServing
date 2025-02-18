import React, { useState } from 'react';
import '../styles/Modal.css';

const ModalAdd = ({ item, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: item.name || '',
    price: item.price || '',
    category: item.category || '',
    image_url: item.image_url || '',
    stock: item.stock || 'yes',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add Menu Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Image URL:</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Stock:</label>
            <select
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="input-field"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="submit-btn">Add</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdd;
