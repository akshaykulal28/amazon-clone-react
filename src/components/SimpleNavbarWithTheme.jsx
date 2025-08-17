import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
// import SearchBar from './SearchBar'; // Temporarily commented out
import './Navbar.css'; // Import custom CSS
import { 
  FaShoppingCart, 
  FaMoon, 
  FaSun, 
  FaBars,
  FaUser,
  FaHome,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle
} from 'react-icons/fa';

const SimpleNavbarWithTheme = () => {
  const { getCartItemsCount } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isActiveLink = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsCollapsed(true);
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-custom ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="container-fluid px-3">
        
        {/* Brand Logo */}
        <Link className="navbar-brand-custom" to="/">
          🛒 AmaStore
        </Link>

        {/* Mobile Hamburger Menu */}
        <button
          className="navbar-toggler navbar-toggler-custom"
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>

        {/* Navigation Content */}
        <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarNav">
          
          {/* Main Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link nav-link-custom ${isActiveLink('/')}`} 
                to="/"
                onClick={() => setIsCollapsed(true)}
              >
                <FaHome className="me-1" />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link nav-link-custom ${isActiveLink('/products')}`} 
                to="/products"
                onClick={() => setIsCollapsed(true)}
              >
                All Products
              </Link>
            </li>
          </ul>

          {/* Advanced Search Bar with Performance Optimizations */}
          <div className="search-container">
            {/* <SearchBar 
              className="w-100"
              placeholder="Search Amazon-like products..."
            /> */}
            <input 
              type="search"
              className="form-control search-input-custom"
              placeholder="Search products..."
            />
          </div>

          {/* Right Side Navigation */}
          <ul className="navbar-nav ms-auto align-items-center">
            
            {/* Theme Toggle */}
            <li className="nav-item me-2">
              <button
                className="btn theme-toggle-btn"
                onClick={toggleTheme}
                title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? <FaSun className="me-1" /> : <FaMoon className="me-1" />}
                <span className="d-none d-lg-inline">
                  {isDarkMode ? 'Light' : 'Dark'}
                </span>
              </button>
            </li>

            {/* Shopping Cart */}
            <li className="nav-item me-2">
              <Link 
                className="nav-link cart-btn position-relative"
                to="/cart"
                onClick={() => setIsCollapsed(true)}
              >
                <FaShoppingCart className="me-1" />
                <span className="d-none d-md-inline">Cart</span>
                {getCartItemsCount() > 0 && (
                  <span className="cart-badge">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
            </li>

            {/* User Authentication */}
            {isAuthenticated() ? (
              <li className="nav-item dropdown">
                <button
                  className="btn nav-link dropdown-toggle d-flex align-items-center"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ border: 'none', background: 'none' }}
                >
                  <FaUserCircle className="me-1" />
                  <span className="d-none d-md-inline">
                    {user?.firstName || 'User'}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span className="dropdown-item-text">
                      <small className="text-muted">Welcome, {user?.firstName}!</small>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <FaUser className="me-2" />Profile
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" />Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link 
                  className="nav-link"
                  to="/login"
                  onClick={() => setIsCollapsed(true)}
                >
                  <FaSignInAlt className="me-1" />
                  <span className="d-none d-md-inline">Login</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavbarWithTheme;
