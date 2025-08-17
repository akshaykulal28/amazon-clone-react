import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';
import { 
  FaLock, 
  FaCreditCard, 
  FaPaypal, 
  FaApplePay, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaTruck,
  FaShieldAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEdit,
  FaSpinner,
  FaInfoCircle
} from 'react-icons/fa';

const CheckoutPage = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      sameAsShipping: true,
      address: '',
      city: '',
      state: '',
      pinCode: ''
    }
  });

  const [orderInfo, setOrderInfo] = useState({
    orderNumber: null,
    estimatedDelivery: null,
    trackingNumber: null
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isPromoValid, setIsPromoValid] = useState(null);

  const subtotal = getCartTotal();
  const shipping = subtotal > 1000 ? 0 : 99; // Free shipping over ₹1000
  const tax = subtotal * 0.18; // 18% GST
  const discount = (subtotal * promoDiscount) / 100;
  const total = subtotal + tax + shipping - discount;

  // Available promo codes
  const promoCodes = {
    'SAVE10': 10,
    'WELCOME20': 20,
    'FIRST15': 15,
    'SUMMER25': 25
  };

  // Indian States and Union Territories list
  const indianStates = [
    { value: '', label: 'Select State/UT' },
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'CG', label: 'Chhattisgarh' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JH', label: 'Jharkhand' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'ML', label: 'Meghalaya' },
    { value: 'MZ', label: 'Mizoram' },
    { value: 'NL', label: 'Nagaland' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'SK', label: 'Sikkim' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TS', label: 'Telangana' },
    { value: 'TR', label: 'Tripura' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'UK', label: 'Uttarakhand' },
    { value: 'WB', label: 'West Bengal' },
    { value: 'AN', label: 'Andaman and Nicobar Islands' },
    { value: 'CH', label: 'Chandigarh' },
    { value: 'DH', label: 'Dadra and Nagar Haveli and Daman and Diu' },
    { value: 'DL', label: 'Delhi' },
    { value: 'JK', label: 'Jammu and Kashmir' },
    { value: 'LA', label: 'Ladakh' },
    { value: 'LD', label: 'Lakshadweep' },
    { value: 'PY', label: 'Puducherry' }
  ];

  // Validation utilities
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePinCode = (pinCode) => {
    const pinRegex = /^\d{6}$/;
    return pinRegex.test(pinCode);
  };

  const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
  };

  const validateExpiryDate = (expiryDate) => {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;
    const [month, year] = expiryDate.split('/').map(num => parseInt(num));
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
    return true;
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  // Promo code validation
  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (promoCodes[code]) {
      setPromoDiscount(promoCodes[code]);
      setIsPromoValid(true);
    } else {
      setPromoDiscount(0);
      setIsPromoValid(false);
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setIsPromoValid(null);
  };

  const validateShippingForm = () => {
    const newErrors = {};

    if (!shippingInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!shippingInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(shippingInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (shippingInfo.phone && !validatePhone(shippingInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g., 123-456-7890)';
    }

    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!shippingInfo.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!shippingInfo.state) {
      newErrors.state = 'State/UT is required';
    }

    if (!shippingInfo.pinCode.trim()) {
      newErrors.pinCode = 'PIN code is required';
    } else if (!validatePinCode(shippingInfo.pinCode)) {
      newErrors.pinCode = 'Please enter a valid 6-digit PIN code';
    }

    return newErrors;
  };

  const validatePaymentForm = () => {
    const newErrors = {};

    if (paymentInfo.paymentMethod === 'credit') {
      if (!paymentInfo.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }

      if (!paymentInfo.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!validateCardNumber(paymentInfo.cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }

      if (!paymentInfo.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!validateExpiryDate(paymentInfo.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }

      if (!paymentInfo.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!validateCVV(paymentInfo.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
    }

    return newErrors;
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateShippingForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validatePaymentForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setStep(3);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Generate order details
    const orderNumber = `AMS${Date.now()}`;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (shipping === 0 ? 2 : 5)); // Faster delivery for free shipping orders
    const trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Longer loading for realism
      
      setOrderInfo({
        orderNumber,
        estimatedDelivery: deliveryDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        trackingNumber
      });
      
      setOrderPlaced(true);
      clearCart();
      
      // Auto redirect after 5 seconds
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      console.error('Order placement failed:', error);
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value, isShipping = true) => {
    if (isShipping) {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checking out.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="mb-4">
            <FaCheckCircle className="text-success" style={{ fontSize: '5rem' }} />
          </div>
          <h1 className="text-success mb-3">Order Placed Successfully!</h1>
          <p className="lead mb-4">
            Thank you for your purchase! Your order has been confirmed and will be processed shortly.
          </p>
          
          <div className="row justify-content-center mb-5">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">Order Confirmation</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <strong>Order Number:</strong><br />
                      <span className="text-primary">{orderInfo.orderNumber}</span>
                    </div>
                    <div className="col-md-6 mb-3">
                      <strong>Tracking Number:</strong><br />
                      <span className="text-primary">{orderInfo.trackingNumber}</span>
                    </div>
                    <div className="col-md-6 mb-3">
                      <strong>Total Amount:</strong><br />
                      <span className="h5 text-success">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="col-md-6 mb-3">
                      <strong>Estimated Delivery:</strong><br />
                      <span className="text-info">
                        <FaCalendarAlt className="me-1" />
                        {orderInfo.estimatedDelivery}
                      </span>
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div className="row">
                    <div className="col-md-6">
                      <strong>Shipping Address:</strong><br />
                      <address className="mb-0">
                        {shippingInfo.firstName} {shippingInfo.lastName}<br />
                        {shippingInfo.address}<br />
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.pinCode}
                      </address>
                    </div>
                    <div className="col-md-6">
                      <strong>Payment Method:</strong><br />
                      {paymentInfo.paymentMethod === 'credit' && `Credit Card ending in ****${paymentInfo.cardNumber.slice(-4)}`}
                      {paymentInfo.paymentMethod === 'paypal' && 'PayPal'}
                      {paymentInfo.paymentMethod === 'apple' && 'Apple Pay'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info mb-4">
            <FaInfoCircle className="me-2" />
            <strong>What's Next?</strong><br />
            • A confirmation email has been sent to {shippingInfo.email}<br />
            • You'll receive tracking information once your order ships<br />
            • You can track your order using the tracking number above
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
            <button 
              className="btn btn-outline-primary btn-lg"
              onClick={() => window.print()}
            >
              Print Receipt
            </button>
          </div>
          
          <p className="text-muted mt-4">
            <small>Redirecting to homepage in a few seconds...</small>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <div className="row">
            <div className="col-lg-8">
              {/* Progress Indicator */}
              <div className="mb-4">
                <div className="d-flex justify-content-center">
                  <div className="d-flex" style={{ gap: '80px' }}>
                    <div className={`text-center ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
                      <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${step >= 1 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: '40px', height: '40px'}}>
                        1
                      </div>
                      <div>Shipping</div>
                    </div>
                    <div className={`text-center ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
                      <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${step >= 2 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: '40px', height: '40px'}}>
                        2
                      </div>
                      <div>Payment</div>
                    </div>
                    <div className={`text-center ${step >= 3 ? 'text-primary' : 'text-muted'}`}>
                      <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${step >= 3 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: '40px', height: '40px'}}>
                        3
                      </div>
                      <div>Review</div>
                    </div>
                  </div>
                </div>
              </div>

          {/* Step 1: Shipping Information */}
          {step === 1 && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Shipping Information</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleShippingSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        value={shippingInfo.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value, true)}
                        required
                      />
                      {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        value={shippingInfo.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value, true)}
                        required
                      />
                      {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value, true)}
                        required
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone (Optional)</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="+91 98765 43210"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value, true)}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Street Address *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      placeholder="123 Main Street, Apartment 4B"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value, true)}
                      required
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value, true)}
                        required
                      />
                      {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">State *</label>
                      <select
                        className={`form-select ${errors.state ? 'is-invalid' : ''}`}
                        value={shippingInfo.state}
                        onChange={(e) => handleInputChange('state', e.target.value, true)}
                        required
                      >
                        {indianStates.map(state => (
                          <option key={state.value} value={state.value}>
                            {state.label}
                          </option>
                        ))}
                      </select>
                      {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">PIN Code *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.pinCode ? 'is-invalid' : ''}`}
                        placeholder="123456"
                        value={shippingInfo.pinCode}
                        onChange={(e) => handleInputChange('pinCode', e.target.value, true)}
                        required
                      />
                      {errors.pinCode && <div className="invalid-feedback">{errors.pinCode}</div>}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/cart')}>
                      Back to Cart
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Step 2: Payment Information */}
          {step === 2 && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <FaLock className="me-2" />
                  Payment Information
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handlePaymentSubmit}>
                  {/* Payment Method Selection */}
                  <div className="mb-4">
                    <label className="form-label">Payment Method</label>
                    <div className="row">
                      <div className="col-md-4 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            value="credit"
                            checked={paymentInfo.paymentMethod === 'credit'}
                            onChange={(e) => setPaymentInfo({...paymentInfo, paymentMethod: e.target.value})}
                          />
                          <label className="form-check-label">
                            <FaCreditCard className="me-1" />
                            Credit Card
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={paymentInfo.paymentMethod === 'paypal'}
                            onChange={(e) => setPaymentInfo({...paymentInfo, paymentMethod: e.target.value})}
                          />
                          <label className="form-check-label">
                            <FaPaypal className="me-1" />
                            PayPal
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            value="apple"
                            checked={paymentInfo.paymentMethod === 'apple'}
                            onChange={(e) => setPaymentInfo({...paymentInfo, paymentMethod: e.target.value})}
                          />
                          <label className="form-check-label">
                            <FaApplePay className="me-1" />
                            Apple Pay
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Credit Card Form */}
                  {paymentInfo.paymentMethod === 'credit' && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Cardholder Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={paymentInfo.cardholderName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Card Number *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                          required
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Expiry Date *</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">CVV *</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentInfo.paymentMethod === 'paypal' && (
                    <div className="text-center p-4 border rounded">
                      <FaPaypal size={40} className="text-primary mb-3" />
                      <p>You will be redirected to PayPal to complete your payment.</p>
                    </div>
                  )}

                  {paymentInfo.paymentMethod === 'apple' && (
                    <div className="text-center p-4 border rounded">
                      <FaApplePay size={40} className="mb-3" />
                      <p>Use Touch ID or Face ID to pay with Apple Pay.</p>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mt-4">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(1)}>
                      Back to Shipping
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Review Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Step 3: Order Review */}
          {step === 3 && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Review Your Order</h5>
              </div>
              <div className="card-body">
                {/* Shipping Address Review */}
                <div className="mb-4">
                  <h6>Shipping Address</h6>
                  <p className="mb-1">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p className="mb-1">{shippingInfo.address}</p>
                  <p className="mb-1">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.pinCode}</p>
                  <p className="mb-0">{shippingInfo.email}</p>
                  <button className="btn btn-link p-0" onClick={() => setStep(1)}>Edit</button>
                </div>

                {/* Payment Method Review */}
                <div className="mb-4">
                  <h6>Payment Method</h6>
                  <p className="mb-0">
                    {paymentInfo.paymentMethod === 'credit' && `Credit Card ending in ${paymentInfo.cardNumber.slice(-4)}`}
                    {paymentInfo.paymentMethod === 'paypal' && 'PayPal'}
                    {paymentInfo.paymentMethod === 'apple' && 'Apple Pay'}
                  </p>
                  <button className="btn btn-link p-0" onClick={() => setStep(2)}>Edit</button>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h6>Order Items</h6>
                  {items.map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <img src={item.image} alt={item.name} style={{width: '40px', height: '40px', objectFit: 'cover'}} className="rounded me-2" />
                        <div>
                          <p className="mb-0">{item.name}</p>
                          <small className="text-muted">Qty: {item.quantity}</small>
                        </div>
                      </div>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleOrderSubmit}>
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" required />
                    <label className="form-check-label">
                      I agree to the <a href="#">Terms and Conditions</a>
                    </label>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(2)}>
                      Back to Payment
                    </button>
                    <button type="submit" className="btn btn-success btn-lg">
                      Place Order - ₹{total.toFixed(2)}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: '100px' }}>
            <div className="card-header">
              <h6 className="mb-0">Order Summary</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                {shipping === 0 ? (
                  <span className="text-success">FREE</span>
                ) : (
                  <span>₹{shipping.toFixed(2)}</span>
                )}
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>GST (18%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>₹{total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
