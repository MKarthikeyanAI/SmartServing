import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import Menu from '../components/Menu';
import Orders from '../components/Orders';
import '../styles/AdminPanel.css';
import ProcessingOrders from '../components/ProcessingOrders'; 

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const restaurantName = 'WafflePondy'; // Example restaurant name

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-panel">
      <Sidebar onTabChange={handleTabChange} activeTab={activeTab} />
      <div className="content">
        {/* {activeTab === 'dashboard' && <Dashboard />} */}
        {activeTab === 'menu' && <Menu />}
        {activeTab === 'orders' && <Orders />}
        {activeTab === 'processingOrders' && <ProcessingOrders restaurantName={restaurantName} />}
      </div>
    </div>
  );
};

export default AdminPanel;
