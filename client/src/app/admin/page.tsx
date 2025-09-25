'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
}

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: Array<{ product: string; quantity: number; price: number }>;
  total: number;
  status: string;
  createdAt: string;
}

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('products');
  const [user, setUser] = useState<{isAdmin: boolean} | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', stock: '' });

  useEffect(() => {
    fetchUser();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data.user);
    } catch (error:any) {
      console.error('Failed to fetch user');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error:any) {
      console.error('Failed to fetch products');
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (error:any) {
      console.error('Failed to fetch orders');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error:any) {
      console.error('Failed to update order status');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          description: formData.description,
          stock: Number(formData.stock)
        })
      });
      setFormData({ name: '', price: '', description: '', stock: '' });
      setShowAddForm(false);
      fetchProducts();
    } catch (error:any) {
      console.error('Failed to add product');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          description: formData.description,
          stock: Number(formData.stock)
        })
      });
      setFormData({ name: '', price: '', description: '', stock: '' });
      setEditingProduct(null);
      fetchProducts();
    } catch (error:any) {
      console.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error:any) {
      console.error('Failed to delete product');
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock.toString()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold">AI E-Commerce Admin</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/products" className="text-gray-600 hover:text-gray-900">Shop</Link>
              <button onClick={() => {localStorage.removeItem('token'); window.location.href = '/';}} className="text-gray-600 hover:text-gray-900">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
                }`}
              >
                Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
                }`}
              >
                Orders ({orders.length})
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'products' && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>

            {(showAddForm || editingProduct) && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-medium mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <div className="flex space-x-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                      {editingProduct ? 'Update' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingProduct(null);
                        setFormData({ name: '', price: '', description: '', stock: '' });
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {products.map((product) => (
                  <li key={product._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{product.name}</h3>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600 mb-2">Rs {product.price}</p>
                        <div className="space-x-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Order #{order._id.slice(-8)}</h3>
                      <p className="text-gray-600">{order.user.name} ({order.user.email})</p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{order.items.length} items - Rs {order.total}</p>
                    </div>
                    <div className="text-right">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}