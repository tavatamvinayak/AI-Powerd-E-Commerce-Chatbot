'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

 function Chatbot() {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI shopping assistant. How can I help you find the perfect products today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: "I understand you're looking for recommendations. Based on your query, I'd suggest checking out our latest products in the store!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
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
              {user?.isAdmin && <Link href="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link>}
              <button onClick={() => {logout(); window.location.href = '/';}} className="text-gray-600 hover:text-gray-900">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h1 className="text-xl font-bold">AI Shopping Assistant</h1>
            <p className="text-blue-100">Get personalized product recommendations</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about products, recommendations, or anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left">
            <h3 className="font-semibold text-gray-900">Product Recommendations</h3>
            <p className="text-gray-600 text-sm">Get personalized suggestions</p>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left">
            <h3 className="font-semibold text-gray-900">Compare Products</h3>
            <p className="text-gray-600 text-sm">Find the best options</p>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left">
            <h3 className="font-semibent text-gray-900">Order Help</h3>
            <p className="text-gray-600 text-sm">Track and manage orders</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Chatbot), { ssr: false });