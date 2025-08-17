import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginPromptModal from './LoginPromptModal';
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaShoppingCart, 
  FaHeart,
  FaRegHeart,
  FaEye,
  FaTruck,
  FaShieldAlt,
  FaFire
} from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product, variant = 'default' }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-muted" />);
    }

    return stars;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = addToCart(product);
    
    if (result.requiresLogin) {
      // Show the elegant login modal
      setShowLoginModal(true);
      return;
    }
    
    // Add visual feedback for successful addition
    const button = e.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check me-2"></i>Added!';
    button.classList.add('btn-success');
    button.classList.remove('btn-warning');
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove('btn-success');
      button.classList.add('btn-warning');
    }, 1500);
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  const handleRegisterRedirect = () => {
    setShowLoginModal(false);
    navigate('/register');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOnSale = discountPercentage > 0;
  const isTrending = product.rating >= 4.7;
  const isBestSeller = product.reviews > 2000;

  return (
    <div className="col">
      <div 
        className={`card h-100 product-card ${variant} ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Container */}
        <div className="product-image-container position-relative overflow-hidden">
          <Link to={`/product/${product.id}`} className="d-block image-link" title={`View ${product.name} details`}>
            <div className="image-wrapper">
              {!imageLoaded && (
                <div className="image-placeholder d-flex align-items-center justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <img
                src={product.image}
                className={`card-img-top product-image ${imageLoaded ? 'loaded' : ''}`}
                alt={product.name}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
              {/* Click to view indicator */}
              <div className="click-indicator position-absolute top-50 start-50 translate-middle">
                <div className="indicator-content">
                  <FaEye className="indicator-icon" />
                  <small className="indicator-text">Click to view</small>
                </div>
              </div>
            </div>
          </Link>
          
          {/* Image Overlay - Quick Actions */}
          <div className="product-overlay">
            <div className="quick-actions d-flex flex-column gap-2">
              <button 
                className="btn btn-light btn-sm rounded-circle quick-action-btn"
                onClick={handleWishlistToggle}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                {isWishlisted ? <FaHeart className="text-danger" /> : <FaRegHeart />}
              </button>
              <Link 
                to={`/product/${product.id}`}
                className="btn btn-light btn-sm rounded-circle quick-action-btn"
                title="Quick View"
              >
                <FaEye />
              </Link>
            </div>
          </div>

          {/* Product Badges */}
          <div className="product-badges position-absolute top-0 start-0 p-2">
            {isOnSale && (
              <span className="badge badge-sale me-1 mb-1">
                <FaFire className="me-1" />
                -{discountPercentage}%
              </span>
            )}
            {isBestSeller && (
              <span className="badge badge-bestseller me-1 mb-1">
                Best Seller
              </span>
            )}
            {isTrending && (
              <span className="badge badge-trending me-1 mb-1">
                Trending
              </span>
            )}
            {product.fastDelivery && (
              <span className="badge badge-delivery me-1 mb-1">
                <FaTruck className="me-1" />
                Fast
              </span>
            )}
          </div>

          {/* Stock Status Overlay */}
          {!product.inStock && (
            <div className="stock-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
              <div className="stock-badge">
                <span className="badge bg-dark fs-6 px-3 py-2">Out of Stock</span>
              </div>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column p-3">
          {/* Brand & Category */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="brand-text text-uppercase fw-bold">{product.brand}</small>
            <small className="category-text">{product.category}</small>
          </div>
          
          {/* Product Name */}
          <Link to={`/product/${product.id}`} className="text-decoration-none product-title-link">
            <h6 className="card-title product-title mb-2">{product.name}</h6>
          </Link>

          {/* Rating & Reviews */}
          <div className="rating-section d-flex align-items-center mb-2">
            <div className="stars-container me-2">
              {renderStars(product.rating)}
            </div>
            <small className="rating-text">
              <span className="fw-bold">{product.rating}</span>
              <span className="text-muted">({product.reviews.toLocaleString()})</span>
            </small>
          </div>

          {/* Features Preview */}
          {product.features && product.features.length > 0 && (
            <div className="features-preview mb-2">
              <ul className="feature-list list-unstyled mb-0">
                {product.features.slice(0, 2).map((feature, index) => (
                  <li key={index} className="feature-item">
                    <small className="text-muted">
                      <FaShieldAlt className="me-1" size={10} />
                      {feature}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price Section */}
          <div className="price-section mb-3 mt-auto">
            <div className="d-flex align-items-center justify-content-between">
              <div className="price-container">
                <div className="current-price h5 text-primary mb-0 fw-bold">
                  ₹{product.price.toLocaleString('en-IN')}
                </div>
                {product.originalPrice && (
                  <div className="d-flex align-items-center">
                    <small className="original-price text-muted text-decoration-line-through me-2">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </small>
                    <small className="savings-text text-success fw-bold">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                    </small>
                  </div>
                )}
              </div>
              {isOnSale && (
                <div className="discount-percent">
                  <span className="badge bg-success">{discountPercentage}% OFF</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className={`btn ${product.inStock ? 'btn-warning' : 'btn-secondary'} w-100 fw-bold add-to-cart-btn`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <FaShoppingCart className="me-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            {/* Secondary Actions */}
            <div className="secondary-actions d-flex gap-2 mt-2">
              <Link 
                to={`/product/${product.id}`}
                className="btn btn-outline-primary btn-sm flex-grow-1"
              >
                View Details
              </Link>
              <button 
                className="btn btn-outline-secondary btn-sm"
                title="Compare"
              >
                Compare
              </button>
            </div>
          </div>
        </div>

        {/* Quick Info Footer */}
        <div className="card-footer bg-transparent border-0 p-2">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {product.fastDelivery ? (
                <><FaTruck className="me-1 text-success" />Free delivery</>
              ) : (
                <>Standard delivery</>
              )}
            </small>
            <small className="text-muted">
              <FaShieldAlt className="me-1 text-primary" />
              Warranty included
            </small>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onLogin={handleLoginRedirect}
        onRegister={handleRegisterRedirect}
        productName={product.name}
      />
    </div>
  );
};

export default ProductCard;
