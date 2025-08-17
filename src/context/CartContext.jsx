import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: []
  });
  
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    if (isAuthenticated()) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.items.forEach(item => {
          dispatch({ type: 'ADD_TO_CART', payload: item });
          if (item.quantity > 1) {
            dispatch({ 
              type: 'UPDATE_QUANTITY', 
              payload: { id: item.id, quantity: item.quantity } 
            });
          }
        });
      }
    }
  }, [isAuthenticated]);

  // Save cart to localStorage whenever it changes (only if authenticated)
  useEffect(() => {
    if (isAuthenticated()) {
      localStorage.setItem('cart', JSON.stringify(state));
    }
  }, [state, isAuthenticated]);

  const addToCart = (product) => {
    if (!isAuthenticated()) {
      // Store the intended product to add after login
      localStorage.setItem('pendingCartItem', JSON.stringify(product));
      // Redirect to login will be handled by the component
      return { requiresLogin: true };
    }
    dispatch({ type: 'ADD_TO_CART', payload: product });
    return { requiresLogin: false };
  };

  const removeFromCart = (productId) => {
    if (!isAuthenticated()) return;
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (!isAuthenticated()) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Function to add pending item after login
  const addPendingItem = () => {
    const pendingItem = localStorage.getItem('pendingCartItem');
    if (pendingItem && isAuthenticated()) {
      const product = JSON.parse(pendingItem);
      dispatch({ type: 'ADD_TO_CART', payload: product });
      localStorage.removeItem('pendingCartItem');
      return product;
    }
    return null;
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    addPendingItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
