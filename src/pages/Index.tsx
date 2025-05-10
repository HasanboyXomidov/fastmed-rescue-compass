
import React, { useState, useEffect } from 'react';
import LoginPage from '../components/LoginPage';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const isAuthenticated = localStorage.getItem('fastMed_isLoggedIn') === 'true';
    if (isAuthenticated) {
      setIsLoggedIn(true);
      navigate('/map');
    }
  }, [navigate]);

  const handleLogin = (email: string, password: string) => {
    // In a real app, we would validate credentials with a backend
    // For this MVP, we'll just store login state in localStorage
    localStorage.setItem('fastMed_isLoggedIn', 'true');
    localStorage.setItem('fastMed_userEmail', email);
    setIsLoggedIn(true);
  };

  return (
    <LoginPage onLogin={handleLogin} />
  );
};

export default Index;
