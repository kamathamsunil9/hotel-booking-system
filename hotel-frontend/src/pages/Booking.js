import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { roomService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = Number(searchParams.get('guests')) || 1;

  const [room, setRoom] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setError('Please select valid check-in and check-out dates.');
      setCheckingAvailability(false);
      return;
    }
    loadRoomAndAvailability();
  }, [roomId, checkIn, checkOut]);

  const loadRoomAndAvailability = async () => {
    setCheckingAvailability(true);
    setError('');
    try {
      // 1. Fetch room details
      const roomRes = await roomService.getRoomById(roomId);
      setRoom(roomRes.data);

      // 2. Check availability
      const availRes = await roomService.checkAvailability(roomId, checkIn, checkOut);
      setAvailability(availRes.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error checking room availability';
      setError(msg);
      setAvailability({ available: false, message: msg });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/book/${roomId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}` } } });
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      const payload = {
        roomId: Number(roomId),
        checkIn,
        checkOut,
        guests,
      };

      const res = await bookingService.createBooking(payload);
      const createdBooking = res.data;

      // Directly redirect to Booking Success page - NO PAYMENT GATEWAY
      navigate(`/booking-success/${createdBooking.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (checkingAvailability) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <p>Verifying room availability and pricing...</p>
      </div>
    );
  }

  const nights = availability?.nights || 1;
  const pricePerNight = room?.pricePerNight || 0;
  const totalPrice = nights * pricePerNight;

  return (
    <div className="booking-page container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/hotels">Hotels</Link> &gt; <span>Booking Review</span>
      </div>

      <div className="booking-header">
        <h1 className="page-title">Review & Confirm Booking</h1>
        <p className="page-subtitle">Instant reservation with zero upfront payment gateway requirements</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="booking-grid">
        {/* Left Column: Booking Details */}
        <div className="booking-main-card">
          <div className="card-section">
            <h2 className="section-heading">🏨 Hotel & Room Details</h2>
            <div className="hotel-summary-box">
              <h3>{room?.hotelName}</h3>
              <div className="detail-tags">
                <span className="detail-pill">Room {room?.roomNumber}</span>
                <span className="detail-pill">{room?.roomType} Room</span>
                <span className="detail-pill">Max {room?.capacity} Guests</span>
              </div>
              <p className="room-desc-muted">{room?.description}</p>
            </div>
          </div>

          <div className="card-section">
            <h2 className="section-heading">📅 Stay Schedule</h2>
            <div className="stay-summary-grid">
              <div className="schedule-box">
                <span className="schedule-label">Check-in</span>
                <span className="schedule-date">{checkIn}</span>
                <span className="schedule-time">From 12:00 PM</span>
              </div>

              <div className="schedule-arrow">
                <span>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                <div className="arrow-line">➔</div>
              </div>

              <div className="schedule-box">
                <span className="schedule-label">Check-out</span>
                <span className="schedule-date">{checkOut}</span>
                <span className="schedule-time">Until 11:00 AM</span>
              </div>
            </div>

            <div className="guest-info-row">
              <span>👥 Guests: <strong>{guests} {guests === 1 ? 'Person' : 'People'}</strong></span>
            </div>
          </div>

          <div className="card-section">
            <h2 className="section-heading">👤 Primary Guest Details</h2>
            {isAuthenticated ? (
              <div className="user-info-card">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </div>
            ) : (
              <div className="alert alert-warning">
                You are currently not logged in. You will be prompted to login when confirming your booking.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Price Summary & Instant Confirmation */}
        <div className="booking-sidebar">
          <div className="summary-card">
            <h3 className="summary-title">Booking Summary</h3>

            {/* Live Availability Status */}
            <div className="availability-status-box">
              {availability?.available ? (
                <div className="badge-available">
                  <span className="status-dot green"></span>
                  <span>Room is Available for these dates</span>
                </div>
              ) : (
                <div className="badge-unavailable">
                  <span className="status-dot red"></span>
                  <span>{availability?.message || 'Room is unavailable'}</span>
                </div>
              )}
            </div>

            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>Room Type</span>
                <strong>{room?.roomType}</strong>
              </div>
              <div className="breakdown-row">
                <span>Price per night</span>
                <span>₹{pricePerNight.toLocaleString('en-IN')}</span>
              </div>
              <div className="breakdown-row">
                <span>Duration</span>
                <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
              </div>
              <div className="breakdown-row">
                <span>Guests</span>
                <span>{guests}</span>
              </div>
              <div className="breakdown-divider"></div>
              <div className="breakdown-total">
                <span>Total Price</span>
                <span className="total-amount">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="instant-notice">
              <p>⚡ <strong>Direct Reservation:</strong> Click below to confirm your stay instantly. No payment gateway or credit card required!</p>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block btn-lg"
              disabled={bookingLoading || !availability?.available}
              onClick={handleConfirmBooking}
            >
              {bookingLoading ? 'Confirming Booking...' : 'Confirm Booking'}
            </button>

            <div className="secure-badge">
              <span>🔒 100% Guaranteed Booking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
