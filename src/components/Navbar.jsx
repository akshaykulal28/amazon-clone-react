import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import SearchBar from './SearchBar';
import { 
  FaShoppingCart, 
  FaMoon, 
  FaSun, 
  FaBars,
  FaUser,
  FaHome,
  FaSignInAlt
} from 'react-icons/fa';

const Navbar = () => {
  const { getCartItemsCount } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isActiveLink = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark' : 'navbar-light'} sticky-top shadow`}
         style={{ backgroundColor: isDarkMode ? '#131921' : '#232f3e' }}>
      <div className="container-fluid px-3">
        
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold text-white d-flex align-items-center" to="/">
          <span className="fs-2 me-2">🛒</span>
          <span className="fs-4">
            <span style={{ color: '#ff9900' }}>Ama</span>Store
          </span>
        </Link>

        {/* Mobile Hamburger Menu */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <FaBars className="text-white" />
        </button>

        {/* Navigation Content */}
        <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarNav">
          
          {/* Main Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link text-white px-3 ${isActiveLink('/')}`} 
                to="/"
                onClick={() => setIsCollapsed(true)}
              >
                <FaHome className="me-1" />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link text-white px-3 ${isActiveLink('/products')}`} 
                to="/products"
                onClick={() => setIsCollapsed(true)}
              >
                All Products
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link text-white px-3 ${isActiveLink('/showcase')}`} 
                to="/showcase"
                onClick={() => setIsCollapsed(true)}
              >
                <span className="badge bg-warning text-dark me-1">NEW</span>
                Showcase
              </Link>
            </li>
          </ul>

          {/* Search Bar - Center */}
          <div className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: '500px', width: '100%' }}>
            <SearchBar 
              className="w-100"
              placeholder="Search Amazon-like products..."
            />
          </div>

          {/* Right Side Navigation */}
          <ul className="navbar-nav ms-auto align-items-center">
            
            {/* Theme Toggle */}
            <li className="nav-item me-2">
              <button
                className="btn btn-outline-light btn-sm d-flex align-items-center"
                onClick={toggleTheme}
                title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? <FaSun className="me-1" /> : <FaMoon className="me-1" />}
                <span className="d-none d-lg-inline">
                  {isDarkMode ? 'Light' : 'Dark'}
                </span>
              </button>
            </li>

            {/* Login/Account Dropdown */}
            <li className="nav-item dropdown me-2">
              <a
                className="nav-link dropdown-toggle text-white d-flex align-items-center px-2"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUser className="me-1" />
                <div className="d-none d-md-block">
                  <small className="d-block mb-0" style={{ fontSize: '12px', lineHeight: '1' }}>
                    Hello, Sign in
                  </small>
                  <strong style={{ fontSize: '14px', lineHeight: '1' }}>
                    Account & Lists
                  </strong>
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <h6 className="dropdown-header">
                    <FaSignInAlt className="me-2" />
                    Account
                  </h6>
                </li>
                <li>
                  <Link className="dropdown-item" to="/login">
                    <FaSignInAlt className="me-2" />
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/register">
                    <FaUser className="me-2" />
                    Create Account
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item" href="#">
                    Your Orders
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Your Account
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Your Wishlist
                  </a>
                </li>
              </ul>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <Link
                to="/cart"
                className={`nav-link text-white d-flex align-items-center px-2 position-relative ${isActiveLink('/cart')}`}
                onClick={() => setIsCollapsed(true)}
              >
                <FaShoppingCart size={24} className="me-1" />
                <div className="d-none d-md-block">
                  <small className="d-block mb-0" style={{ fontSize: '12px', lineHeight: '1' }}>
                    Cart
                  </small>
                  <strong style={{ fontSize: '14px', lineHeight: '1' }}>
                    {getCartItemsCount()} items
                  </strong>
                </div>
                
                {/* Cart Badge */}
                {getCartItemsCount() > 0 && (
                  <span 
                    className="position-absolute translate-middle badge rounded-pill"
                    style={{ 
                      backgroundColor: '#ff9900',
                      color: '#000',
                      top: '8px',
                      left: '20px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
