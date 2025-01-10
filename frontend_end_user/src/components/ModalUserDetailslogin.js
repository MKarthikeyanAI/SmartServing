import React, { useState } from "react";
import "../styles/ModalUserDetailslogin.css";

const ModalUserDetailslogin = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ username: "", mobileNumber: "" });


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
        <h2 className="modal-title" >Enter Your Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Mobile Number:</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="submit-btn" >Login</button>
            <button type="button" onClick={onClose} className= "cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUserDetailslogin;
