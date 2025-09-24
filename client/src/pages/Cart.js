import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import { orderAPI } from '../services/api';

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', zipCode: '', country: ''
  });

  if (!user) {
    return <div>Please login to view your cart.</div>;
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress
      };
      
      await orderAPI.createOrder(orderData);
      dispatch(clearCart());
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert('Error placing order: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  if (items.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div>
      <h1>Shopping Cart</h1>
      {items.map((item) => (
        <div key={item.product._id} className="cart-item">
          <div>
            <img src={item.product.image} alt={item.product.name} style={{ width: '10%' }} />
            <h3>{item.product.name}</h3>
            <p>${item.price}</p>
          </div>
          <div>
            <button onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}>-</button>
            <span style={{ margin: '0 1rem' }}>{item.quantity}</span>
            <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}>+</button>
            <button 
              onClick={() => dispatch(removeFromCart(item.product._id))}
              className="btn btn-danger"
              style={{ marginLeft: '1rem' }}
            >
              Remove
            </button>
          </div>
          <div>Rs. {(item.price * item.quantity).toFixed(2)}</div>
        </div>
      ))}
      
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h3>Total: Rs. {total.toFixed(2)}</h3>
        
        <h3>Shipping Address</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Street"
            value={shippingAddress.street}
            onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="City"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Zip Code"
            value={shippingAddress.zipCode}
            onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Country"
            value={shippingAddress.country}
            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
          />
        </div>
        
        <button onClick={handleCheckout} className="btn">Place Order</button>
      </div>
    </div>
  );
};

export default Cart;