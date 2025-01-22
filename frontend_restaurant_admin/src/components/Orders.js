import React, { useEffect, useState, useCallback } from 'react';
import { getOrders } from '../api';
import OrderCard from '../components/OrderCard';
import MenuSidebar from '../components/MenuSidebar';
import '../styles/Orders.css';
import { ClipLoader } from 'react-spinners';
import io from 'socket.io-client';

const Orders = ({ restaurantName, onNewOrder }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to handle new orders
  const handleNewOrder = useCallback(
    (newOrder) => {
      if (newOrder.restaurant_name === restaurantName) {
        setOrders((prevOrders) => [...prevOrders, newOrder]);
        if (onNewOrder) onNewOrder(); // Notify parent about the new order
      }
    },
    [restaurantName, onNewOrder]
  );

  // Connect to WebSocket and listen for new orders
  useEffect(() => {
    const socket = io('http://localhost:5000'); // Backend WebSocket URL

    // Listen for 'new_order' events
    socket.on('new_order', handleNewOrder);

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [handleNewOrder]);

  // Fetch orders from the API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedOrders = await getOrders(restaurantName);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [restaurantName]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
