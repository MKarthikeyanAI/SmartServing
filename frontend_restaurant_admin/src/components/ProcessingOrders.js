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
  const [filter, setFilter] = useState('All'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

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
      // Case 1: Processing orders first (highest priority)
      if (a.status === 'Processing' && b.status !== 'Processing') {
        return -1; // a comes first
      }
      if (a.status !== 'Processing' && b.status === 'Processing') {
        return 1;  // b comes first
      }
  
     
      if (a.status === 'Completed Payment' && b.status !== 'Completed Payment') {
        return 1;  // a comes last
      }
      if (a.status !== 'Completed Payment' && b.status === 'Completed Payment') {
        return -1; // b comes last
      }
  
      return 0;
    });
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'All') return true;
    return order.status === filter;
  });

  const refreshOrders = async () => {
    setLoading(true); // Set loading to true before fetching
    const fetchedOrders = await getProcessingOrders(restaurantName);  // Fetch updated orders
    const sortedOrders = sortOrders(fetchedOrders);  // Apply the sorting logic
    setOrders(sortedOrders);  // Set the sorted orders to state
    setLoading(false); // Set loading to false after fetching
  };

  const handleDetailsClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="orders-container">
      <div className="filter-container-1">
        <button className="filter-button-1" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          Filter
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-option" onClick={() => handleFilterChange('Processing')}>Processing</div>
            <div className="dropdown-option" onClick={() => handleFilterChange('Food Delivered')}>Food Delivered</div>
            <div className="dropdown-option" onClick={() => handleFilterChange('Completed Payment')}>Completed Payment</div>
            <div className="dropdown-option" onClick={() => handleFilterChange('All')}>All</div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="spinner-container">
          <ClipLoader size={50} color="#123abc" loading={loading} />
        </div>
      ) : (
        <>
        <div className="orders-list">
            {filteredOrders.map((order, index) => (
              <ProcessingOrderCard
                key={index}
                order={order}
                onDetailsClick={handleDetailsClick}
                refreshOrders={refreshOrders}
                restaurantName={restaurantName}
                isSelected={selectedOrder && selectedOrder.order_id === order.order_id}
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
