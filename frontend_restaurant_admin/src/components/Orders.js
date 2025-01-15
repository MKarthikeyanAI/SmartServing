import React, { useEffect, useState } from 'react';
import { getOrders } from '../api';
import OrderCard from '../components/OrderCard.js';
import MenuSidebar from '../components/MenuSidebar.js';
import '../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    const fetchedOrders = await getOrders('WafflePondy');
    setOrders(fetchedOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDetailsClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="orders-container">
      <div className="orders-list">
        {orders.map((order, index) => (
          <OrderCard key={index} order={order} onDetailsClick={handleDetailsClick} refreshOrders={fetchOrders} />
        ))}
      </div>
      <MenuSidebar order={selectedOrder} />
    </div>
  );
};

export default Orders;
