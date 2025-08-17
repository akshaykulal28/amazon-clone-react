import React, { useState } from 'react';
import { categories, brands } from '../data/products';
import { useSearch } from '../context/SearchContext';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaStar, FaTruck, FaCheckCircle, FaDollarSign } from 'react-icons/fa';
import './FilterSidebar.css';

const FilterSidebar = ({ isVisible, onToggle }) => {
  const {
    filters,
    setFilters,
    clearFilters,
    performSearch
  } = useSearch();

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    brand: false,
    rating: true,
    features: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters };
    
    switch (filterType) {
      case 'category':
        newFilters.category = value === 'All Categories' ? '' : value;
        break;
      case 'brand':
        newFilters.brand = value === 'All Brands' ? '' : value;
        break;
      case 'minRating':
        newFilters.minRating = newFilters.minRating === value ? 0 : value;
        break;
      case 'inStock':
        newFilters.inStock = !newFilters.inStock;
        break;
      case 'fastDelivery':
        newFilters.fastDelivery = !newFilters.fastDelivery;
        break;
      case 'priceRange':
        newFilters.minPrice = value[0];
        newFilters.maxPrice = value[1];
        break;
    }
    
    setFilters(newFilters);
    performSearch(undefined, newFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
    performSearch('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.minRating > 0) count++;
    if (filters.inStock) count++;
    if (filters.fastDelivery) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 5000) count++;
    return count;
  };

  const renderSection = (title, icon, isExpanded, onToggle, content) => (
    <div className="filter-section">
      <button
        className="filter-section-toggle"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <h6 className="fw-bold mb-0 d-flex align-items-center">
          <span className="filter-icon">{icon}</span>
          <span>{title}</span>
        </h6>
        <span className="chevron">
          {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </span>
      </button>
      {isExpanded && <div className="filter-content">{content}</div>}
    </div>
  );

  const renderPriceRange = () => (
    <div className="price-range-container">
      <div className="mb-3">
        <label className="form-label small text-muted">
          Price Range: ${filters.minPrice} - ${filters.maxPrice}
        </label>
        <div className="price-inputs">
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.maxPrice])}
          />
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('priceRange', [filters.minPrice, parseInt(e.target.value) || 5000])}
          />
        </div>
        <div className="price-range-slider">
          <input
            type="range"
            className="form-range"
            min="0"
            max="5000"
            step="50"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('priceRange', [filters.minPrice, parseInt(e.target.value)])}
          />
        </div>
        <div className="price-range-labels">
          <span>$0</span>
          <span>$5000</span>
        </div>
      </div>
      
      {/* Quick price filters */}
      <div className="quick-price-filters">
        {[
          { label: 'Under $50', range: [0, 50] },
          { label: '$50-$200', range: [50, 200] },
          { label: '$200-$500', range: [200, 500] },
          { label: '$500+', range: [500, 5000] }
        ].map((quickFilter, index) => (
          <button
            key={index}
            className={`quick-price-btn ${
              filters.minPrice === quickFilter.range[0] && filters.maxPrice === quickFilter.range[1]
                ? 'active'
                : ''
            }`}
            onClick={() => handleFilterChange('priceRange', quickFilter.range)}
          >
            {quickFilter.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div>
      {categories.map(category => (
        <div key={category} className="filter-check">
          <input
            className="form-check-input"
            type="radio"
            name="category"
            id={`category-${category}`}
            checked={filters.category === category || (category === 'All Categories' && !filters.category)}
            onChange={() => handleFilterChange('category', category)}
          />
          <label className="form-check-label" htmlFor={`category-${category}`}>
            {category}
          </label>
        </div>
      ))}
    </div>
  );

  const renderBrands = () => (
    <div className="brand-list">
      {brands.map(brand => (
        <div key={brand} className="filter-check">
          <input
            className="form-check-input"
            type="radio"
            name="brand"
            id={`brand-${brand}`}
            checked={filters.brand === brand || (brand === 'All Brands' && !filters.brand)}
            onChange={() => handleFilterChange('brand', brand)}
          />
          <label className="form-check-label" htmlFor={`brand-${brand}`}>
            {brand}
          </label>
        </div>
      ))}
    </div>
  );

  const renderRatings = () => (
    <div>
      {[4, 3, 2, 1].map(rating => (
        <div key={rating} className="filter-check">
          <input
            className="form-check-input"
            type="radio"
            name="rating"
            id={`rating-${rating}`}
            checked={filters.minRating === rating}
            onChange={() => handleFilterChange('minRating', rating)}
          />
          <label className="form-check-label d-flex align-items-center" htmlFor={`rating-${rating}`}>
            <span className="rating-stars me-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`rating-star ${i < rating ? 'text-warning' : 'text-light'}`} />
              ))}
            </span>
            & Up
          </label>
        </div>
      ))}
    </div>
  );

  const renderFeatures = () => (
    <div>
      <div className="filter-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="inStock"
          checked={filters.inStock}
          onChange={() => handleFilterChange('inStock')}
        />
        <label className="form-check-label d-flex align-items-center" htmlFor="inStock">
          <FaCheckCircle className="filter-label-icon text-success" />
          In Stock Only
        </label>
      </div>

      <div className="filter-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="fastDelivery"
          checked={filters.fastDelivery}
          onChange={() => handleFilterChange('fastDelivery')}
        />
        <label className="form-check-label d-flex align-items-center" htmlFor="fastDelivery">
          <FaTruck className="filter-label-icon text-primary" />
          Fast Delivery
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isVisible && (
        <div 
          className="filter-overlay d-md-none"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`filter-sidebar ${isVisible ? 'show' : ''}`}>
        
        {/* Header */}
        <div className="filter-header">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0 d-flex align-items-center">
              <FaFilter className="text-primary me-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="filter-badge">{getActiveFiltersCount()}</span>
              )}
            </h5>
            <button 
              className="mobile-close-btn d-md-none"
              onClick={onToggle}
              aria-label="Close filters"
            >
              <FaTimes />
            </button>
          </div>
          
          {getActiveFiltersCount() > 0 && (
            <button 
              className="clear-filters-btn"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>

        <div className="filter-content">
          {/* Price Range */}
          {renderSection(
            'Price Range',
            <FaDollarSign className="text-success" />,
            expandedSections.price,
            () => toggleSection('price'),
            renderPriceRange()
          )}

          {/* Categories */}
          {renderSection(
            'Categories',
            <FaFilter className="text-primary" />,
            expandedSections.category,
            () => toggleSection('category'),
            renderCategories()
          )}

          {/* Brands */}
          {renderSection(
            'Brands',
            <FaCheckCircle className="text-info" />,
            expandedSections.brand,
            () => toggleSection('brand'),
            renderBrands()
          )}

          {/* Rating */}
          {renderSection(
            'Customer Rating',
            <FaStar className="text-warning" />,
            expandedSections.rating,
            () => toggleSection('rating'),
            renderRatings()
          )}

          {/* Features */}
          {renderSection(
            'Features',
            <FaTruck className="text-secondary" />,
            expandedSections.features,
            () => toggleSection('features'),
            renderFeatures()
          )}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;

 
