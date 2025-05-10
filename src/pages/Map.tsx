
import React from 'react';
import MapPage from '../components/MapPage';
import { useNavigate } from 'react-router-dom';

const Map = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('fastMed_isLoggedIn');
    localStorage.removeItem('fastMed_userEmail');
    navigate('/');
  };

  return <MapPage onLogout={handleLogout} />;
};

export default Map;
