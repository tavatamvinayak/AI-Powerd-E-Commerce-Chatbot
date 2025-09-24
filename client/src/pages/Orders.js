import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { orderAPI } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  if (!user) {
    return <div>Please login to view your orders.</div>;
  }

  return (
    <div>
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{ border: '1px solid #ddd', margin: '1rem 0', padding: '1rem' }}>
            <h3>Order #{order._id}</h3>
            <p>Status: <span style={{ 
              color: order.status === 'delivered' ? 'green' : 
                     order.status === 'shipped' ? 'blue' : 'orange' 
            }}>{order.status}</span></p>
            <p>Total: Rs. {order.total}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            
            <h4>Items:</h4>
            {order.items.map((item, index) => (
              <div key={index} style={{ marginLeft: '1rem' }}>
                <p>{item.product.name} - Quantity: {item.quantity} - Rs. {item.price}</p>
              </div>
            ))}
            
            <h4>Shipping Address:</h4>
            <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;