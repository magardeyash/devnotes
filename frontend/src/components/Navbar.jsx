import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Dev<span className="logo-accent">Notes</span>
        </Link>
        
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-link" style={{ marginRight: '10px' }}>
                Dashboard
              </Link>
              <span className="navbar-user-email" title={user?.name}>
                {user?.email}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link" style={{ marginRight: '15px', textDecoration: 'none', color: 'var(--text-secondary)' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
