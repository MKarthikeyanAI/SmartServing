import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Menu from '../components/Menu';
import Orders from '../components/Orders';
import '../styles/AdminPanel.css';
import ProcessingOrders from '../components/ProcessingOrders'; 

const AdminPanel = ({ restaurantName }) => {
  const [activeTab, setActiveTab] = useState('orders');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-panel">
      <Sidebar onTabChange={handleTabChange} activeTab={activeTab} />
      <div className="content">
        {activeTab === 'menu' && <Menu restaurantName={restaurantName} />}
        {activeTab === 'orders' && <Orders restaurantName={restaurantName} />}
        {activeTab === 'processingOrders' && <ProcessingOrders restaurantName={restaurantName} />}
      </div>
    </div>
  );
};

export default AdminPanel;
