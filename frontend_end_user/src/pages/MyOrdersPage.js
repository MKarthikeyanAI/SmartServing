import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserOrders } from "../api/api";
import "../styles/MyOrdersPage.css";

const MyOrdersPage = () => {
  const { restaurantName, userId } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getUserOrders(restaurantName, userId);
        setOrders(ordersData.orders || []); // Safeguard against invalid data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, [restaurantName, userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="my-orders-page">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(`/${restaurantName}/menu_items`)}>
        Back to Menu
      </button>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.orderId}>
              <div>Order ID: {order.orderId}</div>
              <div>Table Name: {order.table_name}</div>
              <div>Items:</div>
              <ul>
                {order.order.map((item, index) => (
                  <li key={index}>
                    {item.name} - Quantity: {item.quantity}, Price: ₹{item.price}
                  </li>
                ))}
              </ul>
              <div>Status: {order.status}</div>
              <div>Timestamp: {new Date(order.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrdersPage;
