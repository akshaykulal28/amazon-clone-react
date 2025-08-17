import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <FaShoppingBag size={80} className="text-muted mb-4" />
          <h2 className="mb-3">Your cart is empty</h2>
          <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button 
            className="btn btn-link p-0 text-decoration-none me-3"
            onClick={() => navigate('/')}
          >
            <FaArrowLeft className="me-1" />
            Continue Shopping
          </button>
          <h2 className="d-inline">Shopping Cart ({items.length} items)</h2>
        </div>
        <button
          className="btn btn-outline-danger"
          onClick={() => {
            if (window.confirm('Are you sure you want to clear your cart?')) {
              clearCart();
            }
          }}
        >
          Clear Cart
        </button>
      </div>

      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body p-0">
              {items.map((item, index) => (
                <div key={item.id}>
                  <div className="p-4">
                    <div className="row align-items-center">
                      {/* Product Image */}
                      <div className="col-md-2">
                        <Link to={`/product/${item.id}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          />
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="col-md-4">
                        <Link 
                          to={`/product/${item.id}`}
                          className="text-decoration-none text-dark"
                        >
                          <h6 className="mb-1">{item.name}</h6>
                        </Link>
                        <small className="text-muted">{item.brand}</small>
                        <div className="mt-1">
                          {item.inStock ? (
                            <span className="badge bg-success">In Stock</span>
                          ) : (
                            <span className="badge bg-danger">Out of Stock</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-md-3">
                        <div className="d-flex align-items-center justify-content-center">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <FaMinus />
                          </button>
                          <span className="mx-3 fw-bold">{item.quantity}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="col-md-3 text-end">
                        <div className="mb-2">
                          <span className="fw-bold">{formatPrice(item.price * item.quantity)}</span>
                          {item.quantity > 1 && (
                            <div>
                              <small className="text-muted">
                                {formatPrice(item.price)} each
                              </small>
                            </div>
                          )}
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFromCart(item.id)}
                          title="Remove from cart"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                  {index < items.length - 1 && <hr className="m-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: '100px' }}>
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className="text-success">FREE</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>{formatPrice(getCartTotal() * 0.08)}</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="text-primary">
                  {formatPrice(getCartTotal() + (getCartTotal() * 0.08))}
                </strong>
              </div>

              {/* Delivery Info */}
              <div className="bg-light p-3 rounded mb-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-truck text-success me-2"></i>
                  <small className="fw-bold">Free Standard Delivery</small>
                </div>
                <small className="text-muted">
                  Estimated delivery: 3-5 business days
                </small>
              </div>

              <div className="d-grid gap-2">
                <Link to="/checkout" className="btn btn-warning btn-lg">
                  Proceed to Checkout
                </Link>
                <Link to="/" className="btn btn-outline-primary">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="text-center mt-3">
            <small className="text-muted">
              <i className="fas fa-lock me-1"></i>
              Secure checkout with SSL encryption
            </small>
          </div>
        </div>
      </div>

      {/* Recently Viewed or Recommendations */}
      <div className="mt-5">
        <h4 className="mb-3">Customers who bought these items also bought</h4>
        <div className="row">
          <div className="col">
            <div className="bg-light p-4 rounded text-center">
              <p className="text-muted mb-0">Product recommendations would appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
