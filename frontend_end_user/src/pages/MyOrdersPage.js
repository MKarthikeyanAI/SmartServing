// MyOrdersPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserOrders } from "../api/api";
import "../styles/MyOrdersPage.css";


const MyOrdersPage = () => {
  const { restaurantName, userId } = useParams();
  // eslint-disable-next-line
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getUserOrders(restaurantName, userId);
        setOrders(ordersData.orders || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, [restaurantName, userId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="my-orders-page">
      {/* <button className="back-button" onClick={() => navigate(`/${restaurantName}/menu_items`)}>
        Back to Menu
      </button> */}
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <div className="order-id">Order ID: {order.orderId}</div>
                <div className="order-table">Table: {order.table_name}</div>
              </div>
              <div className="order-items">
                <h3>Items:</h3>
                <ul>
                  {order.order.map((item, index) => (
                    <li key={index}>
                      <span className="item-name">{item.name}</span> - Quantity: {item.quantity}, Price: ₹{item.price}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-footer">
                <div className="order-status">Status: {order.status}</div>
                <div className="order-timestamp">
                Ordered: {new Date(order.timestamp).toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true
                })}
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;