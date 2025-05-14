
import React, { useState, useEffect } from 'react';
import LoginPage from '../components/LoginPage';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

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

  const handleLogin = ( phone: string) => {
    // In a real app, we would validate credentials with a backend
    // For this MVP, we'll just store login state in localStorage
    localStorage.setItem('fastMed_isLoggedIn', 'true');
    localStorage.setItem('fastMed_userPhone', phone);
    setIsLoggedIn(true);
  };

  return (
    <LoginPage onLogin={handleLogin} />
  );
};

export default Index;
