import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <h1><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>E-Shop</Link></h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {user ? (
          <>
            <li><Link to="/cart">Cart ({items.length})</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            {user.isAdmin && <li><Link to="/admin">Admin</Link></li>}
            <li><button onClick={handleLogout} className="btn">Logout</button></li>
            <li>Welcome, {user.name}</li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;