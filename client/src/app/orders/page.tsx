'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Order {
  _id: string;
  items: Array<{
    product: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, token } = useAuth();



  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (error:any) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

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
              {user?.isAdmin && <Link href="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link>}
              <button onClick={() => {logout(); window.location.href = '/';}} className="text-gray-600 hover:text-gray-900">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        
        {orders.length == 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
            <Link href="/products" className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            { orders.length === 1 &&  orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order._id.slice(-8)}</h3>
                    <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">{order.items.length} item(s)</p>
                  <p className="text-xl font-bold text-green-600">Rs {order.total}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}