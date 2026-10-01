import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-page container">
      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="profile-name">{user?.name}</h2>
          <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-user'}`}>
            {user?.role} ACCOUNT
          </span>
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <span className="info-label">Full Name</span>
            <span className="info-val">{user?.name}</span>
          </div>

          <div className="profile-info-item">
            <span className="info-label">Email Address</span>
            <span className="info-val">{user?.email}</span>
          </div>

          <div className="profile-info-item">
            <span className="info-label">Account Role</span>
            <span className="info-val">{user?.role}</span>
          </div>

          <div className="profile-info-item">
            <span className="info-label">Account Status</span>
            <span className="info-val status-active">✓ Active & Verified</span>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/my-bookings" className="btn btn-primary">
            View My Bookings
          </Link>
          {isAdmin && (
            <Link to="/admin" className="btn btn-outline">
              Admin Dashboard
            </Link>
          )}
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
