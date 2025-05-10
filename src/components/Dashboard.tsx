
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Check if user is logged in from localStorage on component mount
  useEffect(() => {
    const userIsAuthenticated = localStorage.getItem('fastMed_isLoggedIn') === 'true';
    setIsAuthenticated(userIsAuthenticated);
  }, []);

  // If not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default Dashboard;
