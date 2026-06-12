import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading auth state...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login page
    return <Navigate to="/login" replace />;
  }

  // If children are passed, render them, otherwise render Outlet for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
