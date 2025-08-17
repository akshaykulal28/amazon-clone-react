import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { products } from '../data/products';

const SearchContext = createContext();

const searchReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload,
        isSearching: action.payload.length > 0
      };

    case 'SET_SUGGESTIONS':
      return {
        ...state,
        suggestions: action.payload
      };

    case 'ADD_TO_RECENT':
      const newRecent = [action.payload, ...state.recentSearches.filter(s => s !== action.payload)].slice(0, 10);
      return {
        ...state,
        recentSearches: newRecent
      };

    case 'CLEAR_RECENT':
      return {
        ...state,
        recentSearches: []
      };

    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
        hasSearched: true
      };

    case 'CLEAR_SEARCH':
      return {
        ...state,
        searchTerm: '',
        searchResults: [],
        suggestions: [],
        isSearching: false,
        hasSearched: false
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          category: '',
          brand: '',
          minRating: 0,
          minPrice: 0,
          maxPrice: 5000,
          inStock: false,
          fastDelivery: false,
          sortBy: 'featured'
        }
      };

    case 'SET_SORT':
      return {
        ...state,
        filters: { ...state.filters, sortBy: action.payload }
      };

    default:
      return state;
  }
};

const initialState = {
  searchTerm: '',
  searchResults: [],
  suggestions: [],
  recentSearches: [],
  isSearching: false,
  hasSearched: false,
  filters: {
    category: '',
    brand: '',
    minRating: 0,
    minPrice: 0,
    maxPrice: 5000,
    inStock: false,
    fastDelivery: false,
    sortBy: 'featured'
  }
};

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedRecent = localStorage.getItem('recentSearches');
    if (savedRecent) {
      const recentSearches = JSON.parse(savedRecent);
      recentSearches.forEach(search => {
        dispatch({ type: 'ADD_TO_RECENT', payload: search });
      });
    }
  }, []);

  // Save recent searches to localStorage
  useEffect(() => {
    if (state.recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
    }
  }, [state.recentSearches]);

  // Generate search suggestions
  const generateSuggestions = (term) => {
    if (!term || term.length < 2) {
      dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
      return;
    }

    const suggestions = new Set();
    const normalizedTerm = term.toLowerCase();

    products.forEach(product => {
      // Add product names that match
      if (product.name.toLowerCase().includes(normalizedTerm)) {
        suggestions.add(product.name);
      }

      // Add brand names that match
      if (product.brand.toLowerCase().includes(normalizedTerm)) {
        suggestions.add(product.brand);
      }

      // Add category names that match
      if (product.category.toLowerCase().includes(normalizedTerm)) {
        suggestions.add(product.category);
      }

      // Add feature suggestions
      product.features?.forEach(feature => {
        if (feature.toLowerCase().includes(normalizedTerm)) {
          suggestions.add(feature);
        }
      });
    });

    // Limit suggestions and convert to array
    const suggestionArray = Array.from(suggestions).slice(0, 8);
    dispatch({ type: 'SET_SUGGESTIONS', payload: suggestionArray });
  };

  // Perform search with filters
  const performSearch = (term = state.searchTerm, filters = state.filters) => {
    let results = [...products];

    // Text search
    if (term && term.trim()) {
      const normalizedTerm = term.toLowerCase().trim();
      results = results.filter(product =>
        product.name.toLowerCase().includes(normalizedTerm) ||
        product.brand.toLowerCase().includes(normalizedTerm) ||
        product.category.toLowerCase().includes(normalizedTerm) ||
        product.description?.toLowerCase().includes(normalizedTerm) ||
        product.features?.some(feature => feature.toLowerCase().includes(normalizedTerm))
      );

      // Add to recent searches if it's a new search
      if (term.trim() && !state.recentSearches.includes(term.trim())) {
        dispatch({ type: 'ADD_TO_RECENT', payload: term.trim() });
      }
    }

    // Apply filters
    if (filters.category) {
      results = results.filter(product => product.category === filters.category);
    }

    if (filters.brand) {
      results = results.filter(product => product.brand === filters.brand);
    }

    if (filters.minRating > 0) {
      results = results.filter(product => product.rating >= filters.minRating);
    }

    if (filters.minPrice > 0 || filters.maxPrice < 5000) {
      results = results.filter(product => 
        product.price >= filters.minPrice && product.price <= filters.maxPrice
      );
    }

    if (filters.inStock) {
      results = results.filter(product => product.inStock);
    }

    if (filters.fastDelivery) {
      results = results.filter(product => product.fastDelivery);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.sort((a, b) => b.id - a.id);
        break;
      case 'popularity':
        results.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'discount':
        results.sort((a, b) => {
          const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
          const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
          return discountB - discountA;
        });
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
    return results;
  };

  // Get trending searches based on recent searches (memoized)
  const getTrendingSearches = useCallback(() => {
    const trending = ['iPhone', 'Laptop', 'Headphones', 'Sneakers', 'Smart TV', 'Camera'];
    return trending.filter(term => !state.recentSearches.includes(term)).slice(0, 5);
  }, [state.recentSearches]);

  // Get popular categories (memoized)
  const getPopularCategories = useCallback(() => {
    const categoryCounts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([category]) => category);
  }, []); // Empty dependency array since products don't change

  const value = {
    ...state,
    dispatch,
    generateSuggestions,
    performSearch,
    getTrendingSearches,
    getPopularCategories,
    setSearchTerm: (term) => {
      dispatch({ type: 'SET_SEARCH_TERM', payload: term });
      generateSuggestions(term);
    },
    addToRecent: (term) => dispatch({ type: 'ADD_TO_RECENT', payload: term }),
    clearRecent: () => dispatch({ type: 'CLEAR_RECENT' }),
    clearSearch: () => dispatch({ type: 'CLEAR_SEARCH' }),
    setFilters: (filters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
    clearFilters: () => dispatch({ type: 'CLEAR_FILTERS' }),
    setSort: (sortBy) => dispatch({ type: 'SET_SORT', payload: sortBy })
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
