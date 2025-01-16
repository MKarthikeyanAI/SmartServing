import React from 'react';
import '../styles/ProcessingOrderCard.css';  // Import the new CSS file
import { updateOrderStatus } from '../api';


const ProcessingOrderCard = ({ order, onDetailsClick, refreshOrders, restaurantName }) => {

  const handleFoodDelivered = async () => {
    await updateOrderStatus(restaurantName, order.order_id, 'Food Delivered');
    console.log('Order status updated to Food Delivered');
    refreshOrders(); // Refresh the orders after updating the status
  };

  const handleCompletedPayment = async () => {
    await updateOrderStatus(restaurantName, order.order_id, 'Completed Payment');
    console.log('Order status updated to Completed Payment');
    refreshOrders(); // Refresh the orders after updating the status
  };

  const handleDetails = () => {
    onDetailsClick(order);
  };

  // Determine background color based on order status
  const cardStyle = {
    backgroundColor: order.status === 'Completed Payment' ? '#e6f9e6' : '#fff',
  };

  return (
    <div className="order-card-1" style={cardStyle}>
      <p><strong>Date:</strong> {new Date(order.timestamp).toLocaleString()}</p>
      <p><strong>Customer Name:</strong> {order.username}</p>
      <p><strong>Mobile Number:</strong> {order.mobile_number}</p>
      <p><strong>Table:</strong> {order.table_name}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <div className="order-card-buttons">
        <button onClick={handleFoodDelivered} className="food-delivered">Food Delivered</button>
        <button onClick={handleCompletedPayment} className="completed-payment">Completed Payment</button>
        <button onClick={handleDetails} className="details">Details</button>
      </div>
    </div>
  );
};

export default ProcessingOrderCard;
