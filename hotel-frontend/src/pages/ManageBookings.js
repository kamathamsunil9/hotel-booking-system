import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllBookings();
      setBookings(res.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    setError('');
    setSuccess('');

    try {
      await adminService.updateBookingStatus(id, newStatus);
      setSuccess(`Booking #${id} status updated to ${newStatus}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filterStatus === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === filterStatus);

  return (
    <div className="admin-page container">
      <div className="breadcrumb">
        <Link to="/admin">Admin Dashboard</Link> &gt; <span>Manage Bookings</span>
      </div>

      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Manage Customer Bookings</h1>
          <p className="page-subtitle">Track, review, and update statuses of all hotel bookings</p>
        </div>

        {/* Filter status */}
        <div className="filter-pill-group">
          {['ALL', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              className={`pill-btn ${filterStatus === st ? 'active' : ''}`}
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Dates (In &bull; Out)</th>
                  <th>Guests</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">No bookings found for the selected status filter.</td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id}>
                      <td><strong>#{b.id}</strong></td>
                      <td>
                        <div><strong>{b.userName}</strong></div>
                        <small className="text-muted">{b.userEmail}</small>
                      </td>
                      <td>{b.hotelName}</td>
                      <td>Room {b.roomNumber} ({b.roomType})</td>
                      <td>
                        <div>{b.checkIn}</div>
                        <small className="text-muted">to {b.checkOut} ({b.nights}n)</small>
                      </td>
                      <td>👥 {b.guests}</td>
                      <td><strong>₹{b.totalPrice?.toLocaleString('en-IN')}</strong></td>
                      <td>
                        <span className={`status-badge status-${b.status.toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="select-status-inline"
                          value={b.status}
                          disabled={updatingId === b.id}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
