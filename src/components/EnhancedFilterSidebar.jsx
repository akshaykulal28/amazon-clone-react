import React, { useState } from 'react';
import { categories, brands } from '../data/products';
import { useSearch } from '../context/SearchContext';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaStar, FaTruck, FaCheckCircle, FaDollarSign } from 'react-icons/fa';

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
    <div className="filter-section border-bottom pb-3 mb-3">
      <button
        className="btn btn-link text-decoration-none p-0 w-100 text-start d-flex justify-content-between align-items-center"
        onClick={onToggle}
      >
        <h6 className="fw-bold mb-0 d-flex align-items-center">
          {icon}
          <span className="ms-2">{title}</span>
        </h6>
        {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
      </button>
      {isExpanded && <div className="mt-3">{content}</div>}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isVisible && (
        <div 
          className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-white border-end h-100 position-fixed position-md-sticky top-0 start-0 ${isVisible ? 'd-block' : 'd-none d-md-block'}`}
           style={{ 
             width: '320px', 
             zIndex: 1041,
             top: '76px',
             height: 'calc(100vh - 76px)',
             overflowY: 'auto'
           }}>
        
        {/* Header */}
        <div className="p-3 border-bottom bg-light">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0 d-flex align-items-center">
              <FaFilter className="text-primary me-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="badge bg-primary ms-2">{getActiveFiltersCount()}</span>
              )}
            </h5>
            <button 
              className="btn btn-sm btn-outline-primary d-md-none"
              onClick={onToggle}
            >
              <FaTimes />
            </button>
          </div>
          
          {getActiveFiltersCount() > 0 && (
            <button 
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>

        <div className="p-3">
          {/* Price Range */}
          {renderSection(
            'Price Range',
            <FaDollarSign className="text-success" size={14} />,
            expandedSections.price,
            () => toggleSection('price'),
            <div>
              <div className="mb-3">
                <label className="form-label small text-muted">
                  Price Range: ${filters.minPrice} - ${filters.maxPrice}
                </label>
                <div className="d-flex gap-2 mb-2">
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
              <div className="d-flex flex-wrap gap-1">
                {[
                  { label: 'Under $50', range: [0, 50] },
                  { label: '$50-$200', range: [50, 200] },
                  { label: '$200-$500', range: [200, 500] },
                  { label: '$500+', range: [500, 5000] }
                ].map((quickFilter, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm ${
                      filters.minPrice === quickFilter.range[0] && filters.maxPrice === quickFilter.range[1]
                        ? 'btn-primary'
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => handleFilterChange('priceRange', quickFilter.range)}
                  >
                    {quickFilter.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {renderSection(
            'Categories',
            <FaFilter className="text-primary" size={14} />,
            expandedSections.category,
            () => toggleSection('category'),
            <div>
              {categories.map(category => (
                <div key={category} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="category"
                    id={`category-${category}`}
                    checked={filters.category === category || (category === 'All Categories' && !filters.category)}
                    onChange={() => handleFilterChange('category', category)}
                  />
                  <label className="form-check-label small" htmlFor={`category-${category}`}>
                    {category}
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Brands */}
          {renderSection(
            'Brands',
            <FaCheckCircle className="text-info" size={14} />,
            expandedSections.brand,
            () => toggleSection('brand'),
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {brands.map(brand => (
                <div key={brand} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="brand"
                    id={`brand-${brand}`}
                    checked={filters.brand === brand || (brand === 'All Brands' && !filters.brand)}
                    onChange={() => handleFilterChange('brand', brand)}
                  />
                  <label className="form-check-label small" htmlFor={`brand-${brand}`}>
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Rating */}
          {renderSection(
            'Customer Rating',
            <FaStar className="text-warning" size={14} />,
            expandedSections.rating,
            () => toggleSection('rating'),
            <div>
              {[4, 3, 2, 1].map(rating => (
                <div key={rating} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="rating"
                    id={`rating-${rating}`}
                    checked={filters.minRating === rating}
                    onChange={() => handleFilterChange('minRating', rating)}
                  />
                  <label className="form-check-label d-flex align-items-center small" htmlFor={`rating-${rating}`}>
                    <span className="text-warning me-2 d-flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={12} className={i < rating ? 'text-warning' : 'text-light'} />
                      ))}
                    </span>
                    & Up
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Features */}
          {renderSection(
            'Features',
            <FaTruck className="text-secondary" size={14} />,
            expandedSections.features,
            () => toggleSection('features'),
            <div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="inStock"
                  checked={filters.inStock}
                  onChange={() => handleFilterChange('inStock')}
                />
                <label className="form-check-label small d-flex align-items-center" htmlFor="inStock">
                  <FaCheckCircle className="text-success me-2" size={12} />
                  In Stock Only
                </label>
              </div>

              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="fastDelivery"
                  checked={filters.fastDelivery}
                  onChange={() => handleFilterChange('fastDelivery')}
                />
                <label className="form-check-label small d-flex align-items-center" htmlFor="fastDelivery">
                  <FaTruck className="text-primary me-2" size={12} />
                  Fast Delivery
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
