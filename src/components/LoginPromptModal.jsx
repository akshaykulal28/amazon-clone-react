import React from 'react';
import { FaSignInAlt, FaUserPlus, FaShoppingCart, FaLock } from 'react-icons/fa';

const LoginPromptModal = ({ 
  show, 
  onHide, 
  onLogin, 
  onRegister, 
  productName 
}) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: '16px', border: 'none' }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title d-flex align-items-center w-100 justify-content-center">
              <FaLock className="me-2 text-warning" />
              <span style={{ color: '#232f3e' }}>Login Required</span>
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onHide}
              aria-label="Close"
              style={{ fontSize: '0.75rem' }}
            />
          </div>
          
          <div className="modal-body text-center py-4">
            <div className="mb-4">
              <FaShoppingCart size={48} className="text-warning mb-3" />
              <h5 style={{ color: '#232f3e' }}>
                Sign in to add "{productName}" to your cart
              </h5>
              <p className="text-muted mb-4">
                Join millions of customers and enjoy a personalized shopping experience!
              </p>
            </div>

            {/* Benefits */}
            <div className="row text-center mb-4">
              <div className="col-4">
                <div className="p-2">
                  <FaShoppingCart className="text-success mb-2" />
                  <small className="d-block text-muted">Save Cart</small>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2">
                  <FaUserPlus className="text-info mb-2" />
                  <small className="d-block text-muted">Track Orders</small>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2">
                  <FaLock className="text-warning mb-2" />
                  <small className="d-block text-muted">Secure Checkout</small>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <button 
                className="btn flex-fill fw-bold"
                onClick={onLogin}
                style={{ 
                  backgroundColor: '#ff9900', 
                  borderColor: '#ff9900',
                  color: '#000'
                }}
              >
                <FaSignInAlt className="me-2" />
                Sign In
              </button>
              <button 
                className="btn btn-outline-primary flex-fill"
                onClick={onRegister}
              >
                <FaUserPlus className="me-2" />
                Create Account
              </button>
            </div>

            <div className="mt-3">
              <button 
                className="btn btn-link text-muted"
                onClick={onHide}
              >
                Continue browsing without signing in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
