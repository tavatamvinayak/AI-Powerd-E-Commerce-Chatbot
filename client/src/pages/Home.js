import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productAPI } from '../services/api';
import { setProducts, setLoading } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';

const Home = () => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (searchTerm = '') => {
    try {
      dispatch(setLoading(true));
      const response = await productAPI.getProducts(searchTerm);
      dispatch(setProducts(response.data));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    dispatch(addToCart(product));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Products</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '0.5rem', width: '300px' }}
        />
        <button type="submit" className="btn">Search</button>
      </form>
      
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.name} style={{ width: '100%' }} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">Rs. {product.price}</p>
            <p>Stock: {product.stock}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="btn"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;