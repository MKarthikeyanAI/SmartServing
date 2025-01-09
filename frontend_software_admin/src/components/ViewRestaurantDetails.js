import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantDetails, addMenuItem, updateMenuItem, deleteMenuItem, createQRCodeScanner, getQRCodeScanners } from '../api';
import '../styles/ViewRestaurantDetails.css';
import { QRCodeCanvas } from 'qrcode.react';  // Correct import

const ViewRestaurantDetails = () => {
  const { restaurantName } = useParams();
  const [details, setDetails] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [foodItem, setFoodItem] = useState({
    id: '',
    name: '',
    price: '',
    category: '',
    subcategory: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [tableName, setTableName] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [qrCodes, setQrCodes] = useState([]); // State to store QR codes

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getRestaurantDetails(restaurantName);
        console.log('Restaurant details:', response.data);
        setDetails(response.data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };

    const fetchDetailsAndQRCodes = async () => {
      try {
        const restaurantDetails = await getRestaurantDetails(restaurantName);
        setDetails(restaurantDetails.data);

        const qrCodeData = await getQRCodeScanners(restaurantName);
        setQrCodes(qrCodeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDetailsAndQRCodes();
    fetchDetails();
  }, [restaurantName]);

  
 
  const Base64Image = ({ base64String }) => {
    // Construct the data URL for the image
    const imageSrc = `data:image/png;base64,${base64String}`;
  
    return (
      <div className="qr-code-item">
        <img src={imageSrc} alt="QR Code" style={{ width: '200px', height: '200px' }} />
      </div>
    );
  };

  
  // Handle QR code creation
  const handleCreateQRCode = async (e) => {
    e.preventDefault();
    if (!tableName) {
      setSuccessMessage('Table name is required!');
      return;
    }

    try {
      // Create the QR code for the table
      const qrData = {
        tableName: tableName,
        restaurantName: restaurantName,
      };

      await createQRCodeScanner(restaurantName, qrData);

      setQrCode(`Table: ${tableName}, Restaurant: ${restaurantName}`);
      setSuccessMessage('QR code created successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error creating QR code:', error);
      setSuccessMessage('Failed to create QR code');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleAddOrUpdateFoodItem = async (e) => {
    e.preventDefault();
    try {
      if (isUpdating) {
        console.log("UNIQUE ID OF THE FOLLOWING: ", foodItem.unique_id);
        console.log("FOOD ITEM: ", foodItem);
        await updateMenuItem(restaurantName, foodItem.unique_id, foodItem);
        setSuccessMessage('Food item updated successfully!');
      } else {
        await addMenuItem(restaurantName, foodItem);
        setSuccessMessage('Food item added successfully!');
      }
      setShowAddForm(false);
      setIsUpdating(false);
      setFoodItem({ unique_id: '', name: '', price: '', category: '', subcategory: '' });

      // Refresh restaurant details
      const response = await getRestaurantDetails(restaurantName);
      setDetails(response.data);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error adding/updating food item:', error);
      setSuccessMessage('Failed to add/update food item');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleDeleteFoodItem = async (unique_id) => {
    console.log('Deleting item with unique_id:', unique_id);
    try {
      await deleteMenuItem(restaurantName, unique_id);
      setSuccessMessage('Food item deleted successfully!');
      // Refresh restaurant details
      const response = await getRestaurantDetails(restaurantName);
      setDetails(response.data);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting food item:', error);
      setSuccessMessage('Failed to delete food item');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleEditClick = (item) => {
    setIsUpdating(true);
    setFoodItem({
      unique_id: item.unique_id,
      name: item.name,
      price: item.price,
      category: item.category,
      subcategory: item.subcategory,
    });
    setShowAddForm(true);
  };

  if (!details) return <p>Loading...</p>;

  return (
    <div>
      <h2>{restaurantName} Details</h2>
      <div className="profile-container">
        <h3>Credentials</h3>
        <div className="profile-card">
          <div className="profile-avatar">
            <img src="https://via.placeholder.com/100" alt="User Avatar" />
          </div>
          <div className="profile-details">
            <p><strong>Username:</strong> {details.credentials.username}</p>
            <p><strong>Password:</strong> {details.credentials.password}</p>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="qr-code-container">
        <h3>Create QR Code for Table</h3>
        <form onSubmit={handleCreateQRCode}>
          <input
            type="text"
            placeholder="Enter Table Name"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            required
          />
          <button type="submit">Create QR Code</button>
        </form>
        {qrCode && <QRCodeCanvas value={qrCode} />}
      </div>


      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

{/* <div className="qr-codes-list">
          <h3>QR Codes</h3>
          {qrCodes.map((qrCode) => (
            <div key={qrCode._id} className="qr-code-item">
              <p>Table: {qrCode.table_name}</p>
              <QRCodeCanvas 
        value={`data:image/png;base64,${qrCode.qr_code_image}`} 
      />

              <QRCodeCanvas value={`data:image/png;base64,${qrCode.qr_code_image}`} />
            </div>
          ))}
        </div> */}

<div className="qr-codes-list">
        <h3>QR Codes</h3>
        {qrCodes.map((qrCode) => (
          <Base64Image key={qrCode._id} base64String={qrCode.qr_code_image} />
        ))}
      </div>
      
      <div className="menu-items-header-container">
        <h3>Menu Items</h3>
        <div className="add-food-item-btn-container">
          <button onClick={() => setShowAddForm(true)}>Add Food Item</button>
        </div>
      </div>

      <table className="center-table">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Food Item Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sub-Category</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {details.menu_items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.category}</td>
              <td>{item.subcategory}</td>
              <td>
                <button onClick={() => handleEditClick(item)}>Update</button>
                <button onClick={() => handleDeleteFoodItem(item.unique_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddForm && (
        <form onSubmit={handleAddOrUpdateFoodItem}>
          <h3>{isUpdating ? 'Update Food Item' : 'Add Food Item'}</h3>
          <input
            type="text"
            placeholder="Food Name"
            value={foodItem.name}
            onChange={(e) => setFoodItem({ ...foodItem, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={foodItem.price}
            onChange={(e) => setFoodItem({ ...foodItem, price: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={foodItem.category}
            onChange={(e) => setFoodItem({ ...foodItem, category: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Subcategory"
            value={foodItem.subcategory}
            onChange={(e) => setFoodItem({ ...foodItem, subcategory: e.target.value })}
            required
          />
          <button type="submit">{isUpdating ? 'Update' : 'Add'}</button>
          <button type="button" onClick={() => setShowAddForm(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ViewRestaurantDetails;
