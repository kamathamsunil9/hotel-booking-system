import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data);
    } catch (err) {
      setError('Failed to fetch your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmCancel) return;

    setCancellingId(bookingId);
    setError('');
    setActionSuccess('');

    try {
      await bookingService.cancelBooking(bookingId);
      setActionSuccess(`Booking #${bookingId} was successfully cancelled.`);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="my-bookings-page container">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">Track, view, and manage all your hotel reservations</p>
      </div>

      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your reservations...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📅</span>
          <h3>No bookings found</h3>
          <p>You haven't made any reservations yet. Find and book your ideal stay now!</p>
          <Link to="/hotels" className="btn btn-primary">Browse Available Hotels</Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const isConfirmed = booking.status === 'CONFIRMED';
            return (
              <div key={booking.id} className="booking-card">
                <div className="booking-card-header">
                  <div className="booking-id-tag">
                    <span className="label">Booking ID:</span>
                    <strong>#{booking.id}</strong>
                  </div>
                  <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-card-body">
                  <div className="booking-hotel-info">
                    <h3 className="booking-hotel-name">{booking.hotelName}</h3>
                    <p className="booking-location">📍 {booking.hotelLocation}</p>
                    <div className="booking-room-pill">
                      Room {booking.roomNumber} &bull; {booking.roomType}
                    </div>
                  </div>

                  <div className="booking-dates-info">
                    <div className="date-block">
                      <span className="date-label">Check-in</span>
                      <strong className="date-val">{booking.checkIn}</strong>
                    </div>

                    <div className="date-divider">
                      <span>{booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}</span>
                      <div className="line"></div>
                    </div>

                    <div className="date-block">
                      <span className="date-label">Check-out</span>
                      <strong className="date-val">{booking.checkOut}</strong>
                    </div>
                  </div>

                  <div className="booking-cost-info">
                    <div className="guests-info">
                      <span>👥 {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                    <div className="total-cost">
                      <span className="cost-label">Total Amount</span>
                      <span className="cost-amount">₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-card-actions">
                  <span className="booking-created-date">
                    Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                  </span>

                  {isConfirmed && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                    >
                      {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
