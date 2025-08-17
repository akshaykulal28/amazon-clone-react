import React from 'react';
import Banner from '../components/Banner';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaFire, FaTag, FaCrown } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  // Get featured products (first 8 products)
  const featuredProducts = products.slice(0, 8);
  
  // Get products on sale (products with originalPrice > price)
  const saleProducts = products.filter(product => product.originalPrice > product.price).slice(0, 4);
  
  // Get trending products (highest rated)
  const trendingProducts = products
    .filter(product => product.rating >= 4.7)
    .slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <Banner />
      
      {/* Featured Products Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold mb-2">
                <FaFire className="text-warning me-2" />
                Featured Products
              </h2>
              <p className="text-muted mb-0">Discover our handpicked selection of amazing products</p>
            </div>
            <div className="col-auto">
              <Link to="/products" className="btn btn-outline-primary">
                View All Products
                <FaArrowRight className="ms-2" />
              </Link>
            </div>
          </div>
          
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                variant="default"
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-in"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold mb-2">
                <FaTag className="text-danger me-2" />
                Flash Sale
              </h2>
              <p className="text-muted mb-0">Limited time offers - grab them while they last!</p>
            </div>
            <div className="col-auto">
              {/* Countdown Timer */}
              <div className="d-flex align-items-center bg-danger text-white px-3 py-2 rounded">
                <small className="fw-bold">ENDS IN: 23:45:12</small>
              </div>
            </div>
          </div>
          
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {saleProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                variant="compact"
                style={{ animationDelay: `${index * 0.15}s` }}
                className="animate-in"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold mb-2">
                <FaCrown className="text-warning me-2" />
                Trending Now
              </h2>
              <p className="text-muted mb-0">Most popular products loved by our customers</p>
            </div>
            <div className="col-auto">
              <Link to="/products" className="btn btn-outline-warning">
                See All Trending
                <FaArrowRight className="ms-2" />
              </Link>
            </div>
          </div>
          
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {trendingProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                variant="wide"
                style={{ animationDelay: `${index * 0.12}s` }}
                className="animate-in"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-5 hero-banner">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-6">
              <h3 className="fw-bold text-white mb-3">Stay Updated</h3>
              <p className="text-white-50 mb-4">
                Subscribe to our newsletter and get exclusive deals, new arrivals, and special offers directly to your inbox.
              </p>
              <div className="input-group input-group-lg">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your email address"
                  aria-label="Email address"
                />
                <button className="btn btn-warning fw-bold" type="button">
                  Subscribe
                </button>
              </div>
              <small className="text-white-50 d-block mt-2">
                We respect your privacy. Unsubscribe at any time.
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-4 bg-dark text-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-6 col-md-3 mb-3 mb-md-0">
              <h4 className="fw-bold text-warning mb-1">2M+</h4>
              <small>Products</small>
            </div>
            <div className="col-6 col-md-3 mb-3 mb-md-0">
              <h4 className="fw-bold text-warning mb-1">500K+</h4>
              <small>Happy Customers</small>
            </div>
            <div className="col-6 col-md-3">
              <h4 className="fw-bold text-warning mb-1">50+</h4>
              <small>Countries</small>
            </div>
            <div className="col-6 col-md-3">
              <h4 className="fw-bold text-warning mb-1">24/7</h4>
              <small>Support</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
