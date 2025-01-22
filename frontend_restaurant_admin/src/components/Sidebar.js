import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ onTabChange, activeTab,newOrderNotification }) => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        {/* <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => onTabChange('dashboard')}>
          Dashboard
        </li> */}
         <li
          className={`${
            activeTab === 'orders' ? 'active' : ''
          } ${newOrderNotification ? 'notification' : ''}`}
          onClick={() => onTabChange('orders')}
        >
          Orders
          {newOrderNotification && <span className="dot"></span>}
        </li>
        <li className={activeTab === 'menu' ? 'active' : ''} onClick={() => onTabChange('menu')}>
          Menu
        </li>
        <li className={activeTab === 'processingOrders' ? 'active' : ''} onClick={() => onTabChange('processingOrders')}>
          Processing Orders
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
