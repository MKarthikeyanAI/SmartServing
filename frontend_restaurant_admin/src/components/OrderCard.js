import React from 'react';
import '../styles/OrderCard.css';
import { updateOrderStatus ,deleteOrder} from '../api';

const OrderCard = ({ order, onDetailsClick, refreshOrders, restaurantName }) => {
  // const restaurantName = 'WafflePondy';

  const handleAccept = async () => {
    await updateOrderStatus(restaurantName, order.order_id, 'Processing');
    console.log('Order status updated to processing');
    refreshOrders(); // Refresh the orders after updating the status
  };

  const handleReject = async () => {
    const confirmed = window.confirm('Do you confirm to reject this order?');
    if (confirmed) {
      await deleteOrder(restaurantName, order.order_id);
      console.log('Order deleted successfully');
      refreshOrders(); // Refresh the orders after deleting
    }
  };

  return (
    <div className="order-card">
      <p><strong>Date:</strong> {new Date(order.timestamp).toLocaleString()}</p>
      <p><strong>Customer Name:</strong> {order.username}</p>
      <p><strong>Mobile Number:</strong> {order.mobile_number}</p>
      <p><strong>Table:</strong> {order.table_name}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <div className="order-card-buttons-1">
        <button onClick={handleAccept} className="accept">Accept</button>
        <button onClick={handleReject} className="reject">Reject</button>
        <button onClick={() => onDetailsClick(order)} className="details">Details</button>
      </div>
    </div>
  );
};

export default OrderCard;
