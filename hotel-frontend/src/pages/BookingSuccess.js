import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../services/api';

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await bookingService.getBookingById(bookingId);
      setBooking(res.data);
    } catch (err) {
      console.error('Failed to load booking:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-success-page container">
      <div className="success-card">
        <div className="success-icon-wrapper">
          <span className="success-check-icon">✓</span>
        </div>

        <span className="success-badge">CONFIRMED</span>
        <h1 className="success-title">Booking Confirmed Successfully!</h1>
        <p className="success-subtitle">
          Your reservation has been confirmed directly. Have a wonderful stay!
        </p>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading confirmation details...</p>
          </div>
        ) : booking ? (
          <div className="success-details-box">
            <div className="success-detail-row">
              <span className="detail-name">Booking Reference ID</span>
              <strong className="detail-value highlight">#{booking.id}</strong>
            </div>

            <div className="success-detail-row">
              <span className="detail-name">Hotel Name</span>
              <strong className="detail-value">{booking.hotelName}</strong>
            </div>

            <div className="success-detail-row">
              <span className="detail-name">Location</span>
              <span className="detail-value">📍 {booking.hotelLocation}</span>
            </div>

            <div className="success-detail-row">
              <span className="detail-name">Room Reserved</span>
              <span className="detail-value">Room {booking.roomNumber} ({booking.roomType})</span>
            </div>

            <div className="success-detail-row">
              <span className="detail-name">Check-in</span>
              <span className="detail-value">{booking.checkIn}</span>
            </div>

            <div className="success-detail-row">
              <span className="detail-name">Check-out</span>
              <span className="detail-value">{booking.checkOut} ({booking.nights} nights)</span>
            </div>

            <div className="success-detail-row">
              <span className="detail-name">Guests</span>
              <span className="detail-value">{booking.guests}</span>
            </div>

            <div className="success-detail-row highlight-total">
              <span className="detail-name">Total Price</span>
              <strong className="detail-value total-price">₹{booking.totalPrice?.toLocaleString('en-IN')}</strong>
            </div>

            <div className="success-detail-row">
              <span className="detail-name">Booking Status</span>
              <span className="status-badge status-confirmed">{booking.status}</span>
            </div>
          </div>
        ) : (
          <p>Booking details recorded.</p>
        )}

        <div className="success-actions">
          <Link to="/my-bookings" className="btn btn-primary">
            View My Bookings
          </Link>
          <Link to="/hotels" className="btn btn-outline">
            Explore More Hotels
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
