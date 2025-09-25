'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import Link from 'next/link';
import { RootState } from '@/store/store';
import { removeFromCart, clearCart } from '@/store/cartSlice';

export default function Cart() {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const [ordering, setOrdering] = useState(false);

  const handleOrder = async () => {
    setOrdering(true);
    try {
      const token = localStorage.getItem('token');
      const orderItems = items.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: 'Default Address'
        })
      });

      if (res.ok) {
        dispatch(clearCart());
        alert('Order placed successfully!');
        window.location.href = '/orders';
      } else {
        alert('Order failed');
      }
    } catch (error:any) {
      alert('Order failed');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold">AI E-Commerce</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-4 border-b">
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold">Rs {(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Total: Rs {total.toFixed(2)}</span>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleOrder}
                    disabled={ordering}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {ordering ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}