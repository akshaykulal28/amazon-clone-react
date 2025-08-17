import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { FaSearch, FaTimes, FaClock, FaFire, FaTrendingUp, FaFilter } from 'react-icons/fa';

const SearchBar = ({ className = '', placeholder = "Search products..." }) => {
  const navigate = useNavigate();
  const {
    searchTerm,
    suggestions,
    recentSearches,
    setSearchTerm,
    performSearch,
    addToRecent,
    clearRecent,
    getTrendingSearches,
    getPopularCategories
  } = useSearch();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Memoize expensive operations to prevent constant recalculation
  const trendingSearches = useMemo(() => getTrendingSearches(), [getTrendingSearches]);
  const popularCategories = useMemo(() => getPopularCategories(), [getPopularCategories]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setIsExpanded(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showDropdown) return;

      const allItems = [
        ...suggestions,
        ...recentSearches,
        ...trendingSearches,
        ...popularCategories
      ];

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => (prev < allItems.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && allItems[activeIndex]) {
            handleSearchSelect(allItems[activeIndex]);
          } else {
            handleSearch();
          }
          break;
        case 'Escape':
          setShowDropdown(false);
          setActiveIndex(-1);
          searchRef.current?.blur();
          break;
      }
    };

    if (showDropdown) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDropdown, activeIndex, suggestions, recentSearches, trendingSearches, popularCategories]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
    setActiveIndex(-1);
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
    setShowDropdown(true);
  };

  const handleSearch = (term = searchTerm) => {
    if (term.trim()) {
      addToRecent(term);
      performSearch(term);
      navigate('/products');
    }
    setShowDropdown(false);
    setIsExpanded(false);
    searchRef.current?.blur();
  };

  const handleSearchSelect = (selectedTerm) => {
    setSearchTerm(selectedTerm);
    handleSearch(selectedTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveIndex(-1);
    searchRef.current?.focus();
  };

  const handleClearRecent = (e) => {
    e.stopPropagation();
    clearRecent();
  };

  const renderDropdownSection = (title, items, icon, startIndex = 0) => {
    if (!items.length) return null;

    return (
      <div className="search-dropdown-section">
        <div className="search-dropdown-header d-flex align-items-center justify-content-between px-3 py-2">
          <span className="text-muted small fw-bold d-flex align-items-center">
            {icon}
            <span className="ms-2">{title}</span>
          </span>
          {title === 'Recent Searches' && items.length > 0 && (
            <button
              className="btn btn-sm btn-link text-muted p-0"
              onClick={handleClearRecent}
              title="Clear recent searches"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
        {items.slice(0, 5).map((item, index) => {
          const globalIndex = startIndex + index;
          return (
            <button
              key={`${title}-${index}`}
              className={`search-dropdown-item w-100 text-start border-0 px-3 py-2 d-flex align-items-center ${
                activeIndex === globalIndex ? 'bg-light' : 'bg-transparent'
              }`}
              onClick={() => handleSearchSelect(item)}
              onMouseEnter={() => setActiveIndex(globalIndex)}
            >
              <FaSearch className="text-muted me-3" size={12} />
              <span>{item}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const allItems = [...suggestions, ...recentSearches, ...trendingSearches, ...popularCategories];

  return (
    <div className={`search-container position-relative ${className}`} style={{ maxWidth: '600px', width: '100%' }}>
      <div 
        ref={searchRef}
        className={`search-input-container d-flex align-items-center transition-all ${
          isExpanded ? 'shadow-lg' : 'shadow-sm'
        }`}
        style={{
          background: 'white',
          borderRadius: '8px',
          border: isExpanded ? '2px solid #ff9900' : '1px solid #ddd',
          transition: 'all 0.2s ease'
        }}
      >
        <div className="flex-grow-1 position-relative">
          <input
            type="text"
            className="form-control border-0 px-3 py-2"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              outline: 'none',
              boxShadow: 'none',
              fontSize: '14px',
              borderRadius: '8px 0 0 8px'
            }}
          />
          
          {searchTerm && (
            <button
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted p-1 me-2"
              onClick={handleClearSearch}
              style={{ zIndex: 10 }}
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>

        <button
          className="btn text-dark fw-bold border-0 px-3 py-2"
          style={{ 
            backgroundColor: '#ff9900',
            borderRadius: '0 8px 8px 0',
            minWidth: '50px'
          }}
          onClick={() => handleSearch()}
        >
          <FaSearch />
        </button>
      </div>

      {/* Search Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="search-dropdown position-absolute w-100 bg-white border shadow-lg mt-1"
          style={{
            borderRadius: '8px',
            zIndex: 1050,
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          {searchTerm && suggestions.length > 0 && renderDropdownSection(
            'Suggestions', 
            suggestions, 
            <FaSearch className="text-primary" size={12} />,
            0
          )}

          {!searchTerm && recentSearches.length > 0 && renderDropdownSection(
            'Recent Searches', 
            recentSearches, 
            <FaClock className="text-muted" size={12} />,
            suggestions.length
          )}

          {!searchTerm && trendingSearches.length > 0 && renderDropdownSection(
            'Trending', 
            trendingSearches, 
            <FaTrendingUp className="text-success" size={12} />,
            suggestions.length + recentSearches.length
          )}

          {!searchTerm && popularCategories.length > 0 && renderDropdownSection(
            'Popular Categories', 
            popularCategories, 
            <FaFire className="text-danger" size={12} />,
            suggestions.length + recentSearches.length + trendingSearches.length
          )}

          {/* No results message */}
          {searchTerm && suggestions.length === 0 && (
            <div className="text-center py-4 text-muted">
              <FaSearch className="mb-2" size={24} />
              <div>No suggestions found</div>
              <small>Press Enter to search anyway</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
