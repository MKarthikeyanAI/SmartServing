import React, { useEffect, useState, useCallback } from 'react';
import { getOrders } from '../api';
import OrderCard from '../components/OrderCard.js';
import MenuSidebar from '../components/MenuSidebar.js';
import '../styles/Orders.css';
import { ClipLoader } from 'react-spinners'; // Import spinner
import { io } from 'socket.io-client'; // Import socket.io-client

const Orders = ({ restaurantName }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchOrders = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    const fetchedOrders = await getOrders(restaurantName);
    setOrders(fetchedOrders);
    setLoading(false); // Set loading to false after fetching
  }, [restaurantName]);

  useEffect(() => {
    fetchOrders();

    // Establish WebSocket connection
    const socket = io('https://smartserving.onrender.com'); // Replace with your backend URL
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    // Listen for the 'new_order' event
    socket.on('new_order', (newOrder) => {
      if (newOrder.restaurant_name === restaurantName) {
        setOrders((prevOrders) => [...prevOrders, newOrder]);

        setSelectedOrder((prevSelected) => (prevSelected ? prevSelected : newOrder));
      }
    });

    // Clean up the connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [fetchOrders, restaurantName]);

  const handleDetailsClick = (order) => {
    setSelectedOrder(order);
  };


  return (
    <div className="orders-container">
      {loading ? (
        <div className="spinner-container">
          <ClipLoader size={50} color="#123abc" loading={loading} />
        </div>
      ) : (
        <>
          <div className="orders-list">
            {orders.map((order, index) => (
              <OrderCard
                key={index}
                order={order}
                onDetailsClick={handleDetailsClick}
                isSelected={selectedOrder && selectedOrder.order_id === order.order_id}
                refreshOrders={fetchOrders}
                restaurantName={restaurantName}
              />
            ))}
          </div>
          <MenuSidebar order={selectedOrder} />
        </>
      )}
    </div>
  );
};

export default Orders;