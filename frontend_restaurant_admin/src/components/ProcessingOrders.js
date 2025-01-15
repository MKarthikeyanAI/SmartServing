import React, { useEffect, useState } from 'react';
import { getProcessingOrders } from '../api';
import ProcessingOrderCard from './ProcessingOrderCard'; // Import the new card component
import '../styles/Orders.css';

const ProcessingOrders = ({ restaurantName }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchProcessingOrders = async () => {
      const fetchedOrders = await getProcessingOrders(restaurantName);
      setOrders(fetchedOrders);
    };

    fetchProcessingOrders();
  }, [restaurantName]);

  const refreshOrders = async () => {
    const fetchedOrders = await getProcessingOrders(restaurantName);
    setOrders(fetchedOrders);
  };

  return (
    <div className="orders-container">
      <div className="orders-list">
        {orders.map((order, index) => (
          <ProcessingOrderCard key={index} order={order} refreshOrders={refreshOrders} />
        ))}
      </div>
    </div>
  );
};

export default ProcessingOrders;
