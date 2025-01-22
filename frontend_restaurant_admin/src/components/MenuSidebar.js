import React from 'react';
import '../styles/MenuSidebar.css';

const MenuSidebar = ({ order }) => {
 // Check if order or order.order is undefined
 if (!order || !order.order) {
  return <div className="menu-sidebar">Select an order to see details</div>;
}

  // Calculate total bill safely
  const totalBill = order.order.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 0); // Default to 0 if price or quantity is missing
  }, 0).toFixed(2);


  return (
    <div className="menu-sidebar">
      <div className="customer-info">
      <p><strong>Order ID:</strong> {order.order_id}</p>
        <p><strong>Customer Name:</strong> {order.username}</p>
        <p><strong>Mobile Number:</strong> {order.mobile_number}</p>
        <p><strong>Total Bill:</strong> ${totalBill}</p>
      </div>
      <h3>Items</h3>
      {order.order.length > 0 ? (
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
                  <td>{item.name || 'N/A'}</td>
                  <td>{item.quantity || 0}</td>
                  <td>{item.price || 0}</td>
                  <td>{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No items in this order.</p>
      )}
    </div>
  );
};

export default MenuSidebar;