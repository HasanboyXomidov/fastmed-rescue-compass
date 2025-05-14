
import React from 'react';
import MapPage from '../components/MapPage';
import { useNavigate } from 'react-router-dom';
import LocationModal from '@/components/LocationModal';

const Map = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('fastMed_isLoggedIn');
    localStorage.removeItem('fastMed_userPhone');
    navigate('/');
  };  

  // return <MapPage onLogout={handleLogout} />;
  return <LocationModal setAddress={function (address: string): void {
    throw new Error('Function not implemented.');
  } }/>;
};

export default Map;
