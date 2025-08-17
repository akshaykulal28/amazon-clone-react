import React from 'react';
import ProductCard from './ProductCard';
import { products } from '../data/products';

const ProductCardShowcase = () => {
  // Get sample products for demonstration
  const sampleProducts = products.slice(0, 4);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold mb-3">Product Card Showcase</h2>
        <p className="text-muted lead">
          Reusable ProductCard component with Bootstrap styling and CSS hover effects
        </p>
      </div>

      {/* Default Variant */}
      <section className="mb-5">
        <h3 className="fw-bold mb-4">
          <span className="badge bg-primary me-2">Default</span>
          Standard Product Cards
        </h3>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {sampleProducts.map((product, index) => (
            <ProductCard 
              key={`default-${product.id}`} 
              product={product} 
              variant="default"
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-in"
            />
          ))}
        </div>
      </section>

      {/* Compact Variant */}
      <section className="mb-5 bg-light py-5 px-4 rounded">
        <h3 className="fw-bold mb-4">
          <span className="badge bg-success me-2">Compact</span>
          Compact Product Cards
        </h3>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-3">
          {sampleProducts.map((product, index) => (
            <ProductCard 
              key={`compact-${product.id}`} 
              product={product} 
              variant="compact"
              style={{ animationDelay: `${index * 0.15}s` }}
              className="animate-in"
            />
          ))}
        </div>
      </section>

      {/* Wide Variant */}
      <section className="mb-5">
        <h3 className="fw-bold mb-4">
          <span className="badge bg-warning me-2">Wide</span>
          Wide Product Cards
        </h3>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
          {sampleProducts.slice(0, 3).map((product, index) => (
            <ProductCard 
              key={`wide-${product.id}`} 
              product={product} 
              variant="wide"
              style={{ animationDelay: `${index * 0.12}s` }}
              className="animate-in"
            />
          ))}
        </div>
      </section>

      {/* Features Demonstration */}
      <section className="bg-dark text-white py-5 px-4 rounded">
        <div className="text-center mb-4">
          <h3 className="fw-bold text-warning mb-3">Key Features</h3>
          <p className="text-white-50">Enhanced ProductCard component features</p>
        </div>
        
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="text-center">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '60px', height: '60px'}}>
                <i className="fas fa-mobile-alt text-white"></i>
              </div>
              <h5>Responsive Design</h5>
              <p className="small text-white-50">
                Bootstrap grid system with responsive breakpoints
              </p>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <div className="text-center">
              <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '60px', height: '60px'}}>
                <i className="fas fa-mouse-pointer text-white"></i>
              </div>
              <h5>Hover Effects</h5>
              <p className="small text-white-50">
                Smooth CSS transitions and interactive elements
              </p>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <div className="text-center">
              <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '60px', height: '60px'}}>
                <i className="fas fa-puzzle-piece text-dark"></i>
              </div>
              <h5>Reusable</h5>
              <p className="small text-white-50">
                Modular component with customizable variants
              </p>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <div className="text-center">
              <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '60px', height: '60px'}}>
                <i className="fas fa-shopping-cart text-white"></i>
              </div>
              <h5>Interactive</h5>
              <p className="small text-white-50">
                Quick actions, wishlist, and cart integration
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductCardShowcase;
