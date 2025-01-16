import React, { useEffect, useState, useCallback } from 'react';
import { getOrders } from '../api';
import OrderCard from '../components/OrderCard.js';
import MenuSidebar from '../components/MenuSidebar.js';
import '../styles/Orders.css';
import { ClipLoader } from 'react-spinners'; // Import spinner

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
