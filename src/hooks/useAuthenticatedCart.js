import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useAuthenticatedCart = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);

  const requireLogin = (product, action = 'add to cart') => {
    if (!isAuthenticated()) {
      setPendingProduct(product);
      setShowLoginPrompt(true);
      return true;
    }
    return false;
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  const handleCancelLogin = () => {
    setShowLoginPrompt(false);
    setPendingProduct(null);
  };

  return {
    requireLogin,
    showLoginPrompt,
    pendingProduct,
    handleLoginRedirect,
    handleCancelLogin
  };
};
