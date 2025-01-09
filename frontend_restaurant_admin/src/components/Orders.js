import React, { useEffect, useState } from 'react';
import '../styles/Orders.css';
import { getOrders } from '../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then((orderList) => {
      setOrders(orderList);
    });
  }, []);

  return (
    <div className="orders">
      <h2>Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <span>Table {order.table}</span> - <span>{order.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
