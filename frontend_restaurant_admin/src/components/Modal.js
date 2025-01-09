import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

const Modal = ({ item, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    price: item.price,
    category: item.category || '',
    subcategory: item.subcategory || '',
  });

  useEffect(() => {
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category || '',
      subcategory: item.subcategory || '',
    });
  }, [item]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...item, ...formData });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Edit Menu Item</h2>
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
            <label>Subcategory:</label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="submit-btn">Update</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
