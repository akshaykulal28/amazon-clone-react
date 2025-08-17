import React, { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/EnhancedFilterSidebar';
import { FaFilter, FaSort, FaThLarge, FaList, FaSearch } from 'react-icons/fa';

const Products = () => {
  const {
    searchResults,
    searchTerm,
    filters,
    setSort,
    performSearch,
    hasSearched
  } = useSearch();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  // Perform initial search on component mount
  useEffect(() => {
    if (!hasSearched) {
      performSearch('');
    }
  }, [hasSearched]); // Removed performSearch from dependency array to prevent infinite loop

  const handleSortChange = (e) => {
    setSort(e.target.value);
    performSearch(searchTerm, { ...filters, sortBy: e.target.value });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Enhanced Filter Sidebar - Hidden by default */}
        {showFilters && (
          <div className="col-md-3 col-lg-2 p-0">
            <FilterSidebar
              isVisible={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />
          </div>
        )}

        {/* Main Content */}
        <div className={showFilters ? "col-md-9 col-lg-10" : "col-12"}>
          <div className="p-3">
            {/* Results Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-primary me-3"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter className="me-1" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <h4 className="mb-0">
                  {searchTerm ? `Search results for "${searchTerm}"` : 'All Products'}
                  <small className="text-muted ms-2">
                    ({searchResults.length} {searchResults.length === 1 ? 'result' : 'results'})
                  </small>
                </h4>
              </div>

              <div className="d-flex align-items-center gap-3">
                {/* View Mode Toggle */}
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <FaThLarge />
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <FaList />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="d-flex align-items-center">
                  <FaSort className="me-2" />
                  <select 
                    className="form-select form-select-sm" 
                    value={filters.sortBy} 
                    onChange={handleSortChange}
                    style={{ minWidth: '180px' }}
                  >
                    <option value="featured">Featured</option>
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Customer Rating</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Biggest Discount</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.category || filters.brand || filters.minRating > 0 || filters.inStock || filters.fastDelivery || filters.minPrice > 0 || filters.maxPrice < 5000) && (
              <div className="mb-3">
                <h6 className="small text-muted mb-2">Active Filters:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {filters.category && (
                    <span className="badge bg-primary">
                      Category: {filters.category}
                    </span>
                  )}
                  {filters.brand && (
                    <span className="badge bg-info">
                      Brand: {filters.brand}
                    </span>
                  )}
                  {filters.minRating > 0 && (
                    <span className="badge bg-warning">
                      {filters.minRating}+ Stars
                    </span>
                  )}
                  {filters.inStock && (
                    <span className="badge bg-success">
                      In Stock
                    </span>
                  )}
                  {filters.fastDelivery && (
                    <span className="badge bg-secondary">
                      Fast Delivery
                    </span>
                  )}
                  {(filters.minPrice > 0 || filters.maxPrice < 5000) && (
                    <span className="badge bg-dark">
                      ${filters.minPrice} - ${filters.maxPrice}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            {searchResults.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4" 
                : "row g-3"
              }>
                {searchResults.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    variant={viewMode === 'list' ? 'wide' : 'default'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="mb-3">
                  <FaSearch className="text-muted" size={48} />
                </div>
                <h4 className="text-muted mb-3">No products found</h4>
                <p className="text-muted mb-4">
                  {searchTerm 
                    ? `We couldn't find any products matching "${searchTerm}". Try adjusting your search terms or filters.`
                    : 'Try adjusting your filters to find what you\'re looking for.'
                  }
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => performSearch('')}
                  >
                    View All Products
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      // Clear all filters and search
                      performSearch('');
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
