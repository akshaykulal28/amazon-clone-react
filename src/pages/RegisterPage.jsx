import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaShieldAlt, FaCheck, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      // Use the authentication context
      const result = await register(formData);
      
      if (result.success) {
        // Check for pending cart item and add it
        const pendingProduct = addPendingItem();
        
        if (pendingProduct) {
          alert(`🎉 Account created successfully! "${pendingProduct.name}" has been added to your cart! Welcome to AmaStore!`);
        } else {
          alert('🎉 Account created successfully! Welcome to AmaStore family!');
        }
        
        navigate('/');
      } else {
        setIsLoading(false);
        setErrors({ submit: result.error || 'Registration failed. Please try again.' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    if (strength < 2) return { strength: 1, text: 'Weak', color: 'danger' };
    if (strength < 4) return { strength: 2, text: 'Fair', color: 'warning' };
    if (strength < 5) return { strength: 3, text: 'Good', color: 'info' };
    return { strength: 4, text: 'Strong', color: 'success' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
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
                  <h4 className="card-title mb-2" style={{ color: '#232f3e' }}>
                    <FaUserPlus className="me-2" />
                    Create Your Account
                  </h4>
                  <p className="text-muted">Join millions of satisfied customers and start shopping today!</p>
                </div>

                {/* Benefits Banner */}
                <div className="bg-light p-3 rounded mb-4">
                  <div className="row text-center">
                    <div className="col-4">
                      <FaShieldAlt className="text-success mb-1" />
                      <small className="d-block text-muted">Free Shipping</small>
                    </div>
                    <div className="col-4">
                      <FaCheck className="text-success mb-1" />
                      <small className="d-block text-muted">Easy Returns</small>
                    </div>
                    <div className="col-4">
                      <FaLock className="text-success mb-1" />
                      <small className="d-block text-muted">Secure Data</small>
                    </div>
                  </div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                  {/* Display general submit errors */}
                  {errors.submit && (
                    <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                      <FaShieldAlt className="me-2" />
                      <div>{errors.submit}</div>
                    </div>
                  )}

                  {/* Name Fields */}
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                        <FaUser className="me-2 text-muted" />
                        First Name
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.firstName ? 'is-invalid' : ''}`}
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        style={{ borderRadius: '8px', border: '2px solid #e9ecef' }}
                      />
                      {errors.firstName && (
                        <div className="invalid-feedback">{errors.firstName}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                        <FaUser className="me-2 text-muted" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.lastName ? 'is-invalid' : ''}`}
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        style={{ borderRadius: '8px', border: '2px solid #e9ecef' }}
                      />
                      {errors.lastName && (
                        <div className="invalid-feedback">{errors.lastName}</div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                      <FaEnvelope className="me-2 text-muted" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
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
                        placeholder="Create a strong password"
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
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Password strength:</small>
                          <small className={`text-${passwordStrength.color}`}>{passwordStrength.text}</small>
                        </div>
                        <div className="progress" style={{ height: '4px' }}>
                          <div 
                            className={`progress-bar bg-${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    <small className="text-muted">Must contain uppercase, lowercase, number (8+ characters)</small>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                      <FaLock className="me-2 text-muted" />
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        style={{ borderRadius: '8px 0 0 8px', border: '2px solid #e9ecef', borderRight: 'none' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ borderRadius: '0 8px 8px 0', border: '2px solid #e9ecef', borderLeft: 'none' }}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                        id="agreeTerms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                      />
                      <label className="form-check-label text-muted" htmlFor="agreeTerms">
                        I agree to AmaStore's{' '}
                        <Link to="/terms" className="text-decoration-none" style={{ color: '#ff9900' }}>
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-decoration-none" style={{ color: '#ff9900' }}>
                          Privacy Policy
                        </Link>
                      </label>
                      {errors.terms && (
                        <div className="invalid-feedback d-block">{errors.terms}</div>
                      )}
                    </div>
                  </div>

                  {/* Create Account Button */}
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
                        Creating Account...
                      </div>
                    ) : (
                      <span>
                        <FaUserPlus className="me-2" />
                        Create AmaStore Account
                      </span>
                    )}
                  </button>
                </form>

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#ff9900' }}>
                      Sign In Here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Security Info */}
            <div className="text-center mt-4">
              <div className="d-flex justify-content-center align-items-center mb-2">
                <FaShieldAlt className="text-success me-2" />
                <small className="text-muted">Your information is protected with 256-bit SSL encryption</small>
              </div>
              <small className="text-muted">
                By creating an account, you're joining over 1M+ happy customers worldwide
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
