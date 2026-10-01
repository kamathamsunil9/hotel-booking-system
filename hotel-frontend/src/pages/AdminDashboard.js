import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboard();
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-page container">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of system metrics, hotels, rooms, bookings, and users</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* KPI Stats Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box blue">🏨</div>
          <div className="stat-info">
            <span className="stat-label">Total Hotels</span>
            <strong className="stat-number">{stats?.totalHotels || 0}</strong>
          </div>
          <Link to="/admin/hotels" className="stat-link">Manage Hotels &rarr;</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box green">🛏️</div>
          <div className="stat-info">
            <span className="stat-label">Total Rooms</span>
            <strong className="stat-number">{stats?.totalRooms || 0}</strong>
          </div>
          <Link to="/admin/rooms" className="stat-link">Manage Rooms &rarr;</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box orange">📋</div>
          <div className="stat-info">
            <span className="stat-label">Total Bookings</span>
            <strong className="stat-number">{stats?.totalBookings || 0}</strong>
          </div>
          <Link to="/admin/bookings" className="stat-link">Manage Bookings &rarr;</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box purple">👥</div>
          <div className="stat-info">
            <span className="stat-label">Total Users</span>
            <strong className="stat-number">{stats?.totalUsers || 0}</strong>
          </div>
          <Link to="/admin/users" className="stat-link">Manage Users &rarr;</Link>
        </div>
      </div>

      {/* Quick Navigation Panel */}
      <div className="admin-quick-nav">
        <h3>Administrative Controls</h3>
        <div className="quick-nav-buttons">
          <Link to="/admin/hotels" className="btn btn-outline">🏨 Add & Manage Hotels</Link>
          <Link to="/admin/rooms" className="btn btn-outline">🛏️ Add & Manage Rooms</Link>
          <Link to="/admin/bookings" className="btn btn-outline">📑 Manage All Bookings</Link>
          <Link to="/admin/users" className="btn btn-outline">👥 View Registered Users</Link>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="admin-card">
        <div className="card-header-flex">
          <h3>Recent Bookings</h3>
          <Link to="/admin/bookings" className="link-see-all">View all bookings &rarr;</Link>
        </div>

        {!stats?.recentBookings || stats.recentBookings.length === 0 ? (
          <p className="p-muted">No recent bookings found.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Dates</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td><strong>#{b.id}</strong></td>
                    <td>
                      <div>{b.userName}</div>
                      <small className="text-muted">{b.userEmail}</small>
                    </td>
                    <td>{b.hotelName}</td>
                    <td>Room {b.roomNumber} ({b.roomType})</td>
                    <td>{b.checkIn} to {b.checkOut}</td>
                    <td><strong>₹{b.totalPrice?.toLocaleString('en-IN')}</strong></td>
                    <td>
                      <span className={`status-badge status-${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
