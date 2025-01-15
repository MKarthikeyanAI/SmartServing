import React from 'react';
import '../styles/MenuSidebar.css';

const MenuSidebar = ({ order }) => {
  if (!order) {
    return <div className="menu-sidebar">Select an order to see details</div>;
  }

  return (
    <div className="menu-sidebar">
      <h3>Items</h3>
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
  );
};

export default MenuSidebar;
