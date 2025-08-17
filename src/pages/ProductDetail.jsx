import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaShoppingCart, 
  FaHeart,
  FaRegHeart,
  FaShare,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaCheck,
  FaTimes,
  FaEye,
  FaThumbsUp,
  FaThumbsDown,
  FaQuestionCircle,
  FaExpand,
  FaCertificate,
  FaHeadset,
  FaCreditCard,
  FaLock
} from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // State management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showImageModal, setShowImageModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Mock additional product images (in real app, this would come from the product data)
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    // Scroll to top when component mounts or product changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setLoading(true);
    
    // Simulate API call delay for better UX demonstration
    setTimeout(() => {
      const foundProduct = products.find(p => p.id === parseInt(id));
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Generate additional product images (mock data)
        const additionalImages = [
          foundProduct.image,
          foundProduct.image.replace('?w=400', '?w=400&fit=crop&crop=center'),
          foundProduct.image.replace('?w=400', '?w=400&fit=crop&crop=top'),
          foundProduct.image.replace('?w=400', '?w=400&fit=crop&crop=bottom')
        ];
        setProductImages(additionalImages);
        
        // Find related products from the same category
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      
      setLoading(false);
    }, 500);
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Loading product details...</h4>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="mb-4">
            <FaTimes className="text-danger" size={64} />
          </div>
          <h4 className="mb-3">Product not found</h4>
          <p className="text-muted mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <div className="d-flex gap-3 justify-content-center">
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              <FaArrowLeft className="me-2" />
              Go Back
            </button>
            <Link to="/products" className="btn btn-outline-primary">
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (increment) => {
    if (increment && quantity < 10) {
      setQuantity(quantity + 1);
    } else if (!increment && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Product URL copied to clipboard!');
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const isOnSale = discountPercentage > 0;
  const isTrending = product.rating >= 4.7;

  return (
    <div className="product-detail-page">
      <div className="container py-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb bg-light px-3 py-2 rounded">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products" className="text-decoration-none">Products</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/products?category=${product.category}`} className="text-decoration-none">
                {product.category}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Product Images Section */}
          <div className="col-lg-6">
            <div className="product-images-section">
              {/* Main Image */}
              <div className="main-image-container position-relative mb-3">
                <img
                  src={productImages[selectedImage] || product.image}
                  alt={product.name}
                  className="img-fluid rounded-3 shadow-lg product-main-image"
                  style={{ width: '100%', height: '500px', objectFit: 'cover', cursor: 'zoom-in' }}
                  onClick={() => setShowImageModal(true)}
                />
                
                {/* Image Badges */}
                <div className="position-absolute top-0 start-0 p-3">
                  {isOnSale && (
                    <span className="badge bg-danger fs-6 me-2 animate__animated animate__pulse animate__infinite">
                      -{discountPercentage}% OFF
                    </span>
                  )}
                  {isTrending && (
                    <span className="badge bg-warning text-dark fs-6 me-2">
                      🔥 Trending
                    </span>
                  )}
                  {product.fastDelivery && (
                    <span className="badge bg-success fs-6">
                      <FaTruck className="me-1" />
                      Fast Delivery
                    </span>
                  )}
                </div>

                {/* Zoom Indicator */}
                <button 
                  className="btn btn-light position-absolute bottom-0 end-0 m-3 rounded-circle"
                  onClick={() => setShowImageModal(true)}
                  title="Click to zoom"
                >
                  <FaExpand />
                </button>

                {/* Stock Overlay */}
                {!product.inStock && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 rounded-3">
                    <div className="text-center text-white">
                      <FaTimes size={48} className="mb-3" />
                      <h4>Out of Stock</h4>
                      <p>This item is currently unavailable</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="thumbnail-images">
                <div className="row g-2">
                  {productImages.map((image, index) => (
                    <div key={index} className="col-3">
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className={`img-fluid rounded-2 thumbnail-image ${selectedImage === index ? 'active' : ''}`}
                        style={{ height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => setSelectedImage(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Section */}
          <div className="col-lg-6">
            <div className="product-info-section">
              {/* Brand */}
              <div className="brand-section mb-2">
                <Link to={`/products?brand=${product.brand}`} className="text-decoration-none">
                  <span className="badge bg-primary fs-6">{product.brand}</span>
                </Link>
                <span className="ms-2 small text-muted">
                  Visit {product.brand} Store
                </span>
              </div>
              
              {/* Product Name */}
              <h1 className="product-title h2 mb-3 fw-bold">{product.name}</h1>

              {/* Rating and Reviews */}
              <div className="rating-section d-flex align-items-center mb-4">
                <div className="stars me-2 fs-5">
                  {renderStars(product.rating)}
                </div>
                <span className="rating-value fw-bold me-2">{product.rating}</span>
                <span className="review-count text-muted">
                  ({product.reviews.toLocaleString()} reviews)
                </span>
                <span className="ms-3 small">
                  <FaEye className="me-1" />
                  {Math.floor(product.reviews * 2.5).toLocaleString()} views
                </span>
              </div>

              {/* Price Section */}
              <div className="price-section p-4 bg-light rounded-3 mb-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="price-info">
                    <div className="current-price">
                      <span className="h2 text-danger fw-bold mb-0">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="h5 text-muted text-decoration-line-through ms-3">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {isOnSale && (
                      <div className="savings-info">
                        <span className="text-success fw-bold">
                          You save: ${savings.toFixed(2)} ({discountPercentage}% off)
                        </span>
                      </div>
                    )}
                    <div className="payment-info mt-2">
                      <small className="text-muted">
                        <FaCreditCard className="me-1" />
                        Or 4 interest-free payments of ${(product.price / 4).toFixed(2)}
                      </small>
                    </div>
                  </div>
                  
                  {isOnSale && (
                    <div className="discount-badge">
                      <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" 
                           style={{width: '60px', height: '60px'}}>
                        <div className="text-center">
                          <div className="fw-bold">{discountPercentage}%</div>
                          <small style={{fontSize: '0.7rem'}}>OFF</small>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability Status */}
              <div className="availability-section mb-4">
                <div className={`alert ${product.inStock ? 'alert-success' : 'alert-danger'} d-flex align-items-center`}>
                  {product.inStock ? (
                    <>
                      <FaCheck className="me-2" />
                      <strong>In Stock</strong> - Ready to ship
                    </>
                  ) : (
                    <>
                      <FaTimes className="me-2" />
                      <strong>Out of Stock</strong> - Currently unavailable
                    </>
                  )}
                </div>
              </div>

              {/* Quantity and Actions */}
              {product.inStock && (
                <div className="purchase-section mb-4">
                  {/* Quantity Selector */}
                  <div className="quantity-section mb-3">
                    <label className="form-label fw-bold">Quantity:</label>
                    <div className="d-flex align-items-center">
                      <div className="quantity-controls d-flex border rounded">
                        <button 
                          className="btn btn-outline-secondary border-0"
                          onClick={() => handleQuantityChange(false)}
                          disabled={quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <input 
                          type="number" 
                          className="form-control text-center border-0" 
                          style={{width: '60px'}}
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 1 && val <= 10) setQuantity(val);
                          }}
                          min="1" 
                          max="10"
                        />
                        <button 
                          className="btn btn-outline-secondary border-0"
                          onClick={() => handleQuantityChange(true)}
                          disabled={quantity >= 10}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <span className="ms-3 small text-muted">
                        (Max 10 items per order)
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    <button
                      className={`btn btn-lg w-100 mb-3 fw-bold ${addedToCart ? 'btn-success' : 'btn-warning'}`}
                      onClick={handleAddToCart}
                      disabled={addedToCart}
                    >
                      {addedToCart ? (
                        <>
                          <FaCheck className="me-2" />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <FaShoppingCart className="me-2" />
                          Add to Cart - ${(product.price * quantity).toFixed(2)}
                        </>
                      )}
                    </button>
                    
                    <div className="row g-2">
                      <div className="col-6">
                        <button 
                          className={`btn ${isWishlisted ? 'btn-danger' : 'btn-outline-danger'} w-100`}
                          onClick={handleWishlistToggle}
                        >
                          {isWishlisted ? <FaHeart className="me-1" /> : <FaRegHeart className="me-1" />}
                          {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                        </button>
                      </div>
                      <div className="col-6">
                        <button 
                          className="btn btn-outline-secondary w-100"
                          onClick={handleShare}
                        >
                          <FaShare className="me-1" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust Signals */}
              <div className="trust-signals bg-light p-3 rounded-3">
                <div className="row text-center g-3">
                  <div className="col-6 col-md-3">
                    <FaTruck className="text-primary mb-2" size={24} />
                    <div className="small fw-bold">Free Delivery</div>
                    <div className="small text-muted">Orders over $50</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <FaShieldAlt className="text-success mb-2" size={24} />
                    <div className="small fw-bold">Warranty</div>
                    <div className="small text-muted">1 Year Included</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <FaUndo className="text-info mb-2" size={24} />
                    <div className="small fw-bold">Easy Returns</div>
                    <div className="small text-muted">30 Day Policy</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <FaLock className="text-warning mb-2" size={24} />
                    <div className="small fw-bold">Secure Pay</div>
                    <div className="small text-muted">SSL Protected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-tabs mt-5">
          <ul className="nav nav-tabs nav-fill" role="tablist">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Features
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({product.reviews})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'shipping' ? 'active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping & Returns
              </button>
            </li>
          </ul>

          <div className="tab-content p-4 border border-top-0 rounded-bottom">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="tab-pane fade show active">
                <h5 className="mb-3">Product Description</h5>
                <p className="lead">{product.description}</p>
                <div className="row mt-4">
                  <div className="col-md-6">
                    <h6>Specifications</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>Brand:</strong></td>
                          <td>{product.brand}</td>
                        </tr>
                        <tr>
                          <td><strong>Category:</strong></td>
                          <td>{product.category}</td>
                        </tr>
                        <tr>
                          <td><strong>Rating:</strong></td>
                          <td>{product.rating}/5.0</td>
                        </tr>
                        <tr>
                          <td><strong>SKU:</strong></td>
                          <td>SKU-{product.id.toString().padStart(6, '0')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="tab-pane fade show active">
                <h5 className="mb-3">Key Features</h5>
                <div className="row">
                  <div className="col-md-8">
                    <ul className="list-group list-group-flush">
                      {product.features.map((feature, index) => (
                        <li key={index} className="list-group-item d-flex align-items-center">
                          <FaCheck className="text-success me-3" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="tab-pane fade show active">
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center p-4 bg-light rounded">
                      <div className="display-4 fw-bold text-primary">{product.rating}</div>
                      <div className="mb-2">{renderStars(product.rating)}</div>
                      <div className="text-muted">Based on {product.reviews.toLocaleString()} reviews</div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="review-sample p-3 border rounded mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <strong>Sarah M.</strong>
                          <span className="ms-2 small text-muted">Verified Purchase</span>
                        </div>
                        <div>{renderStars(5)}</div>
                      </div>
                      <p className="mb-2">"Excellent product! Exactly as described and fast delivery. Highly recommended."</p>
                      <small className="text-muted">2 days ago</small>
                      <div className="mt-2">
                        <button className="btn btn-sm btn-outline-primary me-2">
                          <FaThumbsUp className="me-1" />
                          Helpful (12)
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                          <FaThumbsDown className="me-1" />
                          (1)
                        </button>
                      </div>
                    </div>
                    <div className="text-center">
                      <button className="btn btn-outline-primary">
                        View All Reviews
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === 'shipping' && (
              <div className="tab-pane fade show active">
                <div className="row">
                  <div className="col-md-6">
                    <h5>Shipping Information</h5>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <FaTruck className="text-primary me-2" />
                        Free standard shipping on orders over $50
                      </li>
                      <li className="mb-2">
                        <FaCertificate className="text-success me-2" />
                        Express shipping available for $9.99
                      </li>
                      <li className="mb-2">
                        <FaHeadset className="text-info me-2" />
                        Order tracking provided via email
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h5>Returns Policy</h5>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <FaUndo className="text-success me-2" />
                        30-day return window
                      </li>
                      <li className="mb-2">
                        <FaShieldAlt className="text-warning me-2" />
                        Items must be in original condition
                      </li>
                      <li className="mb-2">
                        <FaQuestionCircle className="text-primary me-2" />
                        Contact support for return authorization
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Related Products</h3>
              <Link to={`/products?category=${product.category}`} className="btn btn-outline-primary">
                View All in {product.category}
              </Link>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-in"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{product.name}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowImageModal(false)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <img 
                  src={productImages[selectedImage] || product.image} 
                  alt={product.name}
                  className="img-fluid w-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
