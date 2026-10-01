import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { hotelService } from '../services/api';

const HotelDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking parameters
  const today = new Date().toISOString().split('T')[0];
  const nextDay = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || nextDay);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || dayAfter);
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 2);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const fetchHotelDetails = async () => {
    setLoading(true);
    try {
      const res = await hotelService.getHotelById(id);
      setHotel(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Hotel not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoom = (roomId, capacity) => {
    setDateError('');

    if (!checkIn || !checkOut) {
      setDateError('Please select both check-in and check-out dates');
      return;
    }

    if (checkIn < today) {
      setDateError('Cannot book dates in the past');
      return;
    }

    if (checkOut <= checkIn) {
      setDateError('Check-out date must be after check-in date');
      return;
    }

    if (guests > capacity) {
      setDateError(`Guests (${guests}) exceed room capacity (${capacity})`);
      return;
    }

    navigate(`/book/${roomId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  if (loading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="container empty-state">
        <span className="empty-icon">⚠️</span>
        <h3>Hotel Not Found</h3>
        <p>{error || 'The requested hotel could not be found.'}</p>
        <Link to="/hotels" className="btn btn-primary">Back to Hotels</Link>
      </div>
    );
  }

  const amenityIcons = {
    'WiFi': '📶',
    'Parking': '🚗',
    'Swimming Pool': '🏊',
    'Restaurant': '🍽️',
    'Gym': '🏋️',
    'Room Service': '🛎️',
    'Air Conditioning': '❄️',
  };

  const amenitiesList = hotel.amenities ? hotel.amenities.split(',').map((a) => a.trim()) : [];

  return (
    <div className="hotel-details-page container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/hotels">Hotels</Link> &gt; <span>{hotel.name}</span>
      </div>

      {/* Hero Hotel Banner */}
      <div className="hotel-banner-card">
        <div className="hotel-banner-image">
          <img src={hotel.imageUrl} alt={hotel.name} />
          <div className="hotel-banner-overlay">
            <span className="rating-pill">★ {hotel.rating} / 5.0</span>
          </div>
        </div>

        <div className="hotel-banner-info">
          <div className="hotel-location-tag">📍 {hotel.location}</div>
          <h1 className="hotel-banner-title">{hotel.name}</h1>
          <p className="hotel-banner-desc">{hotel.description}</p>

          <div className="hotel-amenities-section">
            <h4>Property Amenities</h4>
            <div className="amenities-tags-grid">
              {amenitiesList.map((amenity, idx) => (
                <div key={idx} className="amenity-badge">
                  <span className="amenity-icon">{amenityIcons[amenity] || '✨'}</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Date & Guest Picker Bar */}
      <div className="stay-picker-box">
        <div className="stay-picker-title">
          <h3>📅 Select Your Stay Dates</h3>
          <p>Dates are pre-filled, customize them to check room rates and availability</p>
        </div>

        {dateError && <div className="alert alert-error">{dateError}</div>}

        <div className="stay-picker-inputs">
          <div className="stay-field">
            <label>Check-in Date</label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div className="stay-field">
            <label>Check-out Date</label>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          <div className="stay-field">
            <label>Guests</label>
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
            </select>
          </div>
        </div>
      </div>

      {/* Available Rooms Section */}
      <div className="rooms-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Available Rooms</h2>
            <p className="section-subtitle">Select the perfect room type for your comfort</p>
          </div>
          <span className="room-count-badge">{hotel.rooms?.length || 0} room types available</span>
        </div>

        {(!hotel.rooms || hotel.rooms.length === 0) ? (
          <div className="empty-state">
            <span className="empty-icon">🛏️</span>
            <h3>No rooms currently available</h3>
            <p>Please check back later or explore other hotels.</p>
          </div>
        ) : (
          <div className="rooms-list">
            {hotel.rooms.map((room) => {
              const isOverCapacity = guests > room.capacity;
              return (
                <div key={room.id} className={`room-card ${isOverCapacity ? 'room-disabled' : ''}`}>
                  <div className="room-card-info">
                    <div className="room-header-row">
                      <h3 className="room-title">
                        {room.roomType} Room <span className="room-number">#{room.roomNumber}</span>
                      </h3>
                      <span className="capacity-badge">
                        👥 Up to {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
                      </span>
                    </div>

                    <p className="room-desc">{room.description}</p>

                    <div className="room-perks">
                      <span>✓ Clean Linens</span>
                      <span>✓ En-suite Bath</span>
                      <span>✓ Flat TV</span>
                      <span>✓ Free WiFi</span>
                    </div>
                  </div>

                  <div className="room-card-action">
                    <div className="room-price-box">
                      <span className="price-tag">₹{room.pricePerNight?.toLocaleString('en-IN')}</span>
                      <span className="price-sub">per night</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-block"
                      onClick={() => handleSelectRoom(room.id, room.capacity)}
                    >
                      Select Room &rarr;
                    </button>

                    {isOverCapacity && (
                      <small className="capacity-warning">
                        ⚠️ Fits max {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}
                      </small>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;
