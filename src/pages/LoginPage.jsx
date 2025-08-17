import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaShieldAlt, FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addPendingItem } = useCart();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      // Use the authentication context
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Check for pending cart item and add it
        const pendingProduct = addPendingItem();
        
        if (pendingProduct) {
          alert(`Welcome back! "${pendingProduct.name}" has been added to your cart! 🛒`);
        } else {
          alert('Login successful! Welcome to AmaStore 🎉');
        }
        
        navigate('/');
      } else {
        setIsLoading(false);
        setErrors({ submit: result.error || 'Login failed. Please try again.' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login integration would be implemented here`);
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: '16px' }}>
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <Link to="/" className="text-decoration-none">
                    <h2 className="mb-3">
                      🛒 <span style={{ color: '#ff9900', fontWeight: 'bold' }}>Ama</span>
                      <span style={{ color: '#232f3e', fontWeight: 'bold' }}>Store</span>
                    </h2>
                  </Link>
                  <h4 className="card-title mb-2" style={{ color: '#232f3e' }}>Welcome Back!</h4>
                  <p className="text-muted">Sign in to your account to continue shopping</p>
                </div>

                {/* Security Notice */}
                <div className="alert alert-info border-0 mb-4" style={{ backgroundColor: '#e7f3ff' }}>
                  <FaShieldAlt className="me-2 text-primary" />
                  <small>Your data is protected with industry-standard encryption</small>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {/* Display general submit errors */}
                  {errors.submit && (
                    <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                      <FaShieldAlt className="me-2" />
                      <div>{errors.submit}</div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                      <FaUser className="me-2 text-muted" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      style={{ borderRadius: '8px', border: '2px solid #e9ecef' }}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                      <FaLock className="me-2 text-muted" />
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        style={{ borderRadius: '8px 0 0 8px', border: '2px solid #e9ecef', borderRight: 'none' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ borderRadius: '0 8px 8px 0', border: '2px solid #e9ecef', borderLeft: 'none' }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="rememberMe" />
                      <label className="form-check-label text-muted" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none" style={{ color: '#ff9900' }}>
                      Forgot password?
                    </Link>
                  </div>

                  {/* Sign In Button */}
                  <button 
                    type="submit" 
                    className="btn btn-lg w-100 mb-4 position-relative"
                    disabled={isLoading}
                    style={{ 
                      backgroundColor: '#ff9900', 
                      borderColor: '#ff9900',
                      color: '#000',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      height: '52px'
                    }}
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In to AmaStore'
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center mb-4">
                  <div className="position-relative">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="row mb-4">
                  <div className="col-6">
                    <button 
                      className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                      onClick={() => handleSocialLogin('Google')}
                      style={{ borderRadius: '8px', height: '48px' }}
                    >
                      <FaGoogle className="me-2" />
                      Google
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                      onClick={() => handleSocialLogin('Facebook')}
                      style={{ borderRadius: '8px', height: '48px' }}
                    >
                      <FaFacebook className="me-2" />
                      Facebook
                    </button>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="bg-light p-3 rounded mb-4">
                  <div className="row text-center">
                    <div className="col-4">
                      <FaShieldAlt className="text-success mb-1" />
                      <small className="d-block text-muted">Secure</small>
                    </div>
                    <div className="col-4">
                      <FaCheck className="text-success mb-1" />
                      <small className="d-block text-muted">Trusted</small>
                    </div>
                    <div className="col-4">
                      <FaLock className="text-success mb-1" />
                      <small className="d-block text-muted">Encrypted</small>
                    </div>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: '#ff9900' }}>
                      Create Account
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-4">
              <small className="text-muted">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-decoration-none">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
