import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🏨</span>
          <span className="brand-text">Stay<span className="brand-accent">Haven</span></span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/hotels" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Hotels
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              My Bookings
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link admin-pill active' : 'nav-link admin-pill')}>
              Admin Panel
            </NavLink>
          )}
        </div>

        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/profile" className="user-profile-badge">
                <span className="avatar-circle">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                <span className="user-name">{user?.name}</span>
                {isAdmin && <span className="badge-admin">ADMIN</span>}
              </Link>
              <button onClick={handleLogout} className="btn-logout" title="Logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
