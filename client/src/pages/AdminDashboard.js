import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { productAPI, orderAPI } from '../services/api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '' ,image:"" });
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await productAPI.createProduct(newProduct);
      setNewProduct({ name: '', description: '', price: '', stock: '',image:''  });
      fetchProducts();
    } catch (error) {
      alert('Error creating product');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await productAPI.updateProduct(editingProduct._id, editingProduct);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      alert('Error updating product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await productAPI.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (error) {
      alert('Error updating order status');
    }
  };

  if (!user?.isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <div className="admin-section">
        <h2>Product Management</h2>
        <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Product Name"
              value={editingProduct ? editingProduct.name : newProduct.name}
              onChange={(e) => editingProduct 
                ? setEditingProduct({ ...editingProduct, name: e.target.value })
                : setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Description"
              value={editingProduct ? editingProduct.description : newProduct.description}
              onChange={(e) => editingProduct 
                ? setEditingProduct({ ...editingProduct, description: e.target.value })
                : setNewProduct({ ...newProduct, description: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Price"
              value={editingProduct ? editingProduct.price : newProduct.price}
              onChange={(e) => editingProduct 
                ? setEditingProduct({ ...editingProduct, price: e.target.value })
                : setNewProduct({ ...newProduct, price: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Stock"
              value={editingProduct ? editingProduct.stock : newProduct.stock}
              onChange={(e) => editingProduct 
                ? setEditingProduct({ ...editingProduct, stock: e.target.value })
                : setNewProduct({ ...newProduct, stock: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Image url"
              value={editingProduct ? editingProduct.image : newProduct.image}
              onChange={(e) => editingProduct 
                ? setEditingProduct({ ...editingProduct, image: e.target.value })
                : setNewProduct({ ...newProduct, image: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="btn">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
          {editingProduct && (
            <button type="button" onClick={() => setEditingProduct(null)} className="btn">
              Cancel
            </button>
          )}
        </form>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} style={{ width: '100%' }} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">Rs. {product.price}</p>
              <p>Stock: {product.stock}</p>
              <button onClick={() => setEditingProduct(product)} className="btn">Edit</button>
              <button onClick={() => handleDeleteProduct(product._id)} className="btn btn-danger">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h2>Order Management</h2>
        {orders.map((order) => (
          <div key={order._id} style={{ border: '1px solid #ddd', margin: '1rem 0', padding: '1rem' }}>
            <h3>Order #{order._id}</h3>
            <p>Customer: {order.user.name} ({order.user.email})</p>
            <p>Total: Rs. {order.total}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <div>
              <p>Shipping Address:- <span className='' style={{}} > {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zipCode}, {order.shippingAddress.country}</span></p>
              
            </div>
            <div>
              <label>Status: </label>
              <select
                value={order.status}
                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            
            <h4>Items:</h4>
            {order.items.map((item, index) => (
              <div key={index}>
                <p>{item.product.name} - Quantity: {item.quantity} - Rs. {item.price}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;