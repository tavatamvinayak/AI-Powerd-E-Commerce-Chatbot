'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { addToCart } from '@/store/cartSlice';
import { RootState } from '@/store/store';
import { useAuth } from '@/context/AuthContext';

interface Product {
  _id: string;
  image:string;
  name: string;
  price: number;
  description: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items.length);



  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/products`);
      const data = await res.json();
      console.log(data)
      setProducts(data);
    } catch (error:any) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
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
              <Link href="/orders" className="text-gray-600 hover:text-gray-900">Orders</Link>
              <Link href="/cart" className="text-gray-600 hover:text-gray-900">Cart ({cartItems})</Link>
              <Link href="/chatbot" className="text-gray-600 hover:text-gray-900">AI Chat</Link>
              {user?.isAdmin && <Link href="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link>}
              <button onClick={() => {logout(); window.location.href = '/';}} className="text-gray-600 hover:text-gray-900">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md p-6">
                <img src={product.image} alt="" />
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">Rs. {product.price}</span>
                  <button 
                    onClick={() => dispatch(addToCart({ _id: product._id, name: product.name, price: product.price }))}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}