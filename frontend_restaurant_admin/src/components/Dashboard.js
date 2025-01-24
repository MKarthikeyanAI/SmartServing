// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getDashboardData } from "../api.js";
import "../styles/Dashboard.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ restaurantName }) => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [processingOrders, setProcessingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const data = await getDashboardData(restaurantName);
      setTotalOrders(data.totalOrders);
      setPendingOrders(data.pendingOrders);
      setProcessingOrders(data.processingOrders);
      setCompletedOrders(data.completedOrders);
    };

    fetchDashboardData();
  }, [restaurantName]);

  // Data for the pie chart
  const pieData = {
    labels: ["Pending", "Processing", "Completed"],
    datasets: [
      {
        data: [pendingOrders, processingOrders, completedOrders],
        backgroundColor: ["#ff9800", "#03a9f4", "#4caf50"],
        hoverBackgroundColor: ["#e68a00", "#0288d1", "#388e3c"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>{restaurantName} Dashboard</h2>
        <p>Overview of your restaurant's order status</p>
      </div>
      <div className="dashboard-cards">
        <div className="card total-orders">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="card pending-orders">
          <h3>Pending Orders</h3>
          <p>{pendingOrders}</p>
        </div>
        <div className="card processing-orders">
          <h3>Processing Orders</h3>
          <p>{processingOrders}</p>
        </div>
        <div className="card completed-orders">
          <h3>Completed Orders</h3>
          <p>{completedOrders}</p>
        </div>
      </div>
      <div className="chart-container">
        <h3>Order Status Distribution</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default Dashboard;
