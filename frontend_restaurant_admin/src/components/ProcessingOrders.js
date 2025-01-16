import React, { useEffect, useState } from 'react';
import { getProcessingOrders } from '../api';
import ProcessingOrderCard from './ProcessingOrderCard.js'; // Import the new card component
import '../styles/Orders.css';
import MenuSidebar from '../components/MenuSidebar.js';
import { ClipLoader } from 'react-spinners'; // Import spinner component


const ProcessingOrders = ({ restaurantName }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcessingOrders = async () => {
      setLoading(true); // Set loading to true before fetching
      const fetchedOrders = await getProcessingOrders(restaurantName);
      setOrders(fetchedOrders);
      const sortedOrders = sortOrders(fetchedOrders);
      setOrders(sortedOrders);
      setLoading(false); // Set loading to false after fetching
    };

    fetchProcessingOrders();
  }, [restaurantName]);

  const sortOrders = (orders) => {
    return orders.sort((a, b) => {
      if (a.status === 'Completed Payment' && b.status !== 'Completed Payment') {
        return 1;
      }
      if (a.status !== 'Completed Payment' && b.status === 'Completed Payment') {
        return -1;
      }
      return 0;
    });
  };

  const refreshOrders = async () => {
    setLoading(true); // Set loading to true before fetching
    const fetchedOrders = await getProcessingOrders(restaurantName);
    setOrders(fetchedOrders);
    setLoading(false); // Set loading to false after fetching
  };

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
    <ProcessingOrderCard 
      key={index} 
      order={order} 
      onDetailsClick={handleDetailsClick} 
      refreshOrders={refreshOrders} 
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

export default ProcessingOrders;
