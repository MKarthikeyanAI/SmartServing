// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../api.js'; 
import '../styles/Dashboard.css'; // Add styles for the dashboard

const Dashboard = ({ restaurantName }) => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [processingOrders, setProcessingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);

  useEffect(() => {
    // Fetch the orders from your backend API and update the state
    const fetchDashboardData = async () => {
      const data = await getDashboardData(restaurantName); // Get the data from the API
      setTotalOrders(data.totalOrders);
      setPendingOrders(data.pendingOrders);
      setProcessingOrders(data.processingOrders);
      setCompletedOrders(data.completedOrders);
    };

    fetchDashboardData();
  }, [restaurantName]);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="card">
          <h3>Pending Orders</h3>
          <p>{pendingOrders}</p>
        </div>
        <div className="card">
          <h3>Processing Orders</h3>
          <p>{processingOrders}</p>
        </div>
        <div className="card">
          <h3>Completed Orders</h3>
          <p>{completedOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
