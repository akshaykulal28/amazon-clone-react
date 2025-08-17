import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bannerSlides = [
    {
      id: 1,
      title: "Up to 70% off",
      subtitle: "Bestselling headphones",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=400&fit=crop",
      brands: ["boAt", "SONY", "JBL", "Audio-Technica"],
      cta: "Shop now",
      bankOffer: "Up to 10% Instant Discount"
    },
    {
      id: 2,
      title: "Great deals on mobiles",
      subtitle: "Latest smartphones",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=400&fit=crop",
      brands: ["iPhone", "Samsung", "OnePlus", "Xiaomi"],
      cta: "Explore",
      bankOffer: "No Cost EMI available"
    },
    {
      id: 3,
      title: "Electronics mega sale",
      subtitle: "Top deals on electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop",
      brands: ["Apple", "Samsung", "LG", "Sony"],
      cta: "Shop deals",
      bankOffer: "Exchange offers available"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Main Banner Carousel */}
      <div className="position-relative banner-carousel" style={{ height: '400px', overflow: 'hidden' }}>
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`position-absolute w-100 h-100 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'opacity 0.5s ease-in-out'
            }}
          >
            <div className="container-fluid h-100 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-md-6">
                  <div className="text-white">
                    <h1 className="display-4 fw-bold mb-3">{slide.title}</h1>
                    <p className="lead mb-4">{slide.subtitle}</p>
                    <div className="d-flex flex-wrap gap-3 mb-4">
                      {slide.brands.map((brand, idx) => (
                        <span key={idx} className="badge bg-light text-dark px-3 py-2 fs-6">
                          {brand}
                        </span>
                      ))}
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-danger fs-6 px-3 py-2">
                          🏦 HDFC BANK
                        </span>
                        <span className="badge bg-danger fs-6 px-3 py-2">
                          💳 HSBC
                        </span>
                        <span className="badge bg-dark fs-6 px-3 py-2">
                          one
                        </span>
                        <span className="badge bg-primary fs-6 px-3 py-2">
                          🏦 RBL BANK
                        </span>
                      </div>
                      <small className="text-light">{slide.bankOffer}</small>
                    </div>
                    <button className="btn btn-warning btn-lg fw-bold px-4 py-3">
                      {slide.cta} →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          className="btn btn-light position-absolute start-0 top-50 translate-middle-y ms-3 rounded-circle"
          onClick={prevSlide}
          style={{ zIndex: 10, width: '50px', height: '50px', opacity: 0.8 }}
        >
          <span style={{ fontSize: '1.5rem' }}>‹</span>
        </button>
        <button
          className="btn btn-light position-absolute end-0 top-50 translate-middle-y me-3 rounded-circle"
          onClick={nextSlide}
          style={{ zIndex: 10, width: '50px', height: '50px', opacity: 0.8 }}
        >
          <span style={{ fontSize: '1.5rem' }}>›</span>
        </button>

        {/* Slide Indicators */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
          <div className="d-flex gap-2">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm rounded-circle ${
                  index === currentSlide ? 'btn-warning' : 'btn-outline-light'
                }`}
                style={{ width: '12px', height: '12px', padding: 0 }}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Amazon-style Content Sections Below Banner */}
      <div className="container-fluid py-4" style={{ backgroundColor: '#eaeded' }}>
        <div className="row g-4">
          {/* Pick up where you left off */}
          <div className="col-lg-3 col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="card-title mb-0 fw-bold">Pick up where you left off</h5>
              </div>
              <div className="card-body p-3">
                <div className="row g-2">
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop" 
                        alt="iPhone 15" 
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        Apple iPhone 15 (128...
                      </small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop" 
                        alt="MacBook" 
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        iPhone 16 128 GB: 5G...
                      </small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100&h=100&fit=crop" 
                        alt="iPhone 13" 
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        Apple iPhone 13 (128G...
                      </small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="https://images.unsplash.com/photo-1519183071298-a2962feb14f4?w=100&h=100&fit=crop" 
                        alt="iPhone 16+" 
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        iPhone 16+ 128 GB: Bu...
                      </small>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <Link to="/products" className="text-decoration-none text-primary small">
                    See more
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Categories to explore */}
          <div className="col-lg-3 col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="card-title mb-0 fw-bold">Categories to explore</h5>
              </div>
              <div className="card-body p-3">
                <div className="row g-2">
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop" 
                        alt="Kitchen" 
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        Juicer mixer grinders
                      </small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="https://images.unsplash.com/photo-1625804505646-7bed95e9ab52?w=100&h=100&fit=crop" 
                        alt="Mobile accessories" 
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        Mobile screen guards
                      </small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="https://images.unsplash.com/photo-1599481238640-4c1288750d7a?w=100&h=100&fit=crop" 
                        alt="Spiritual" 
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        Spiritual items jewelry
                      </small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" 
                        alt="Handbags" 
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        Handbags for women
                      </small>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <Link to="/products" className="text-decoration-none text-primary small">
                    Shop by category
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Deals related to saved items */}
          <div className="col-lg-3 col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="card-title mb-0 fw-bold">Deals related to items you've saved</h5>
              </div>
              <div className="card-body p-3">
                <div className="row g-2">
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="https://images.unsplash.com/photo-1522273400909-fd1a8f77637e?w=100&h=100&fit=crop" 
                        alt="Grooming" 
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        Men's grooming
                      </small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" 
                        alt="Luggage" 
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        Travel luggage
                      </small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" 
                        alt="Backpack" 
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        Backpacks
                      </small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" 
                        alt="Suitcase" 
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        Hard suitcase
                      </small>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <Link to="/products" className="text-decoration-none text-primary small">
                    See all deals
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Amazon Business style promotion */}
          <div className="col-lg-3 col-md-6">
            <div className="card h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #ff9900 0%, #e88900 100%)' }}>
              <div className="card-body text-white p-4">
                <h5 className="card-title fw-bold mb-3">Get wholesale prices on 15 Cr + products</h5>
                <div className="d-flex align-items-end justify-content-between mt-4">
                  <div>
                    <div className="fw-bold mb-1" style={{ fontSize: '1.5rem' }}>AmaStore</div>
                    <div className="small mb-3" style={{ fontSize: '0.9rem' }}>business</div>
                    <button className="btn btn-light btn-sm fw-bold text-dark px-3 py-2">
                      Register now
                    </button>
                  </div>
                  <div className="text-end">
                    <img 
                      src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=80&fit=crop" 
                      alt="Business" 
                      className="img-fluid rounded"
                      style={{ height: '60px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
