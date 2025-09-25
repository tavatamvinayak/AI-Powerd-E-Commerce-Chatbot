'use client';

import Link from "next/link";
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">AI E-Commerce</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
                  <Link href="/orders" className="text-gray-600 hover:text-gray-900">Orders</Link>
                  {user.isAdmin && <Link href="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link>}
                  <button onClick={() => {logout(); window.location.reload();}} className="text-gray-600 hover:text-gray-900">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                  <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to AI E-Commerce</h2>
          <p className="text-xl text-gray-600 mb-8">Shop with AI-powered assistance</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Link href="/products" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
              <p className="text-gray-600">Explore our product catalog</p>
            </Link>
            
            <Link href="/orders" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">My Orders</h3>
              <p className="text-gray-600">Track your purchases</p>
            </Link>
            
            <Link href="/chatbot" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">AI Chatbot</h3>
              <p className="text-gray-600">Get personalized recommendations</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
