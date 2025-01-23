import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Menu from '../components/Menu';
import Orders from '../components/Orders';
import '../styles/AdminPanel.css';
import ProcessingOrders from '../components/ProcessingOrders'; 
import Dashboard from "../components/Dashboard.js"

const AdminPanel = ({ restaurantName }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [newOrderNotification, setNewOrderNotification] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'orders') {
      setNewOrderNotification(false); // Clear notification when viewing Orders tab
    }
  };

  const handleNewOrder = () => {
    if (activeTab !== 'orders') {
      setNewOrderNotification(true); // Notify if not on Orders tab
    }
  };

  return (
    <div className="admin-panel">
      <Sidebar
        onTabChange={handleTabChange}
        activeTab={activeTab}
        newOrderNotification={newOrderNotification}
      />
      <div className="content">
        {activeTab === 'dashboard' && <Dashboard restaurantName={restaurantName} />}
        {activeTab === 'menu' && <Menu restaurantName={restaurantName} />}
        {activeTab === 'orders' && (
          <Orders restaurantName={restaurantName} onNewOrder={handleNewOrder} />
        )}
        {activeTab === 'processingOrders' && <ProcessingOrders restaurantName={restaurantName} />}
      </div>
    </div>
  );
};

export default AdminPanel;
