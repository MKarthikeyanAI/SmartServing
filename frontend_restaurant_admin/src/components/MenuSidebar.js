import React from 'react';
import '../styles/MenuSidebar.css';
import { printOrder } from '../api.js';

const MenuSidebar = ({ order }) => {
  if (!order) {
    return <div className="menu-sidebar">Select an order to see details</div>;
  }

  // Calculate total bill
  const totalBill = order.order.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0).toFixed(2);

  const handlePrint = async () => {
    const orderData = {
      order_id: order.order_id,
      username: order.username,
      mobile_number: order.mobile_number,
      order: order.order,
      total: totalBill,
    };
    const response = await printOrder(orderData);
    if (response?.message) {
      alert(response.message);
    } else {
      alert("Failed to print order.");
    }
  };


  return (
    <div className="menu-sidebar">
      <div className="customer-info">
        <p><strong>Order ID:</strong> {order.order_id}</p>
        <p><strong>Customer Name:</strong> {order.username}</p>
        <p><strong>Mobile Number:</strong> {order.mobile_number}</p>
        <p><strong>Total Bill:</strong> ${totalBill}</p>
      </div>
      <h3>Items</h3>
      <div className="order-details">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.order.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handlePrint} className="print-button">
        Print Order
      </button>
    </div>
  );
};

export default MenuSidebar;
