import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { hotelService } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const today = new Date().toISOString().split('T')[0];
  const nextDay = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState(nextDay);
  const [checkOut, setCheckOut] = useState(dayAfter);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await hotelService.getAllHotels();
      setFeaturedHotels(res.data.slice(0, 6));
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    navigate(`/hotels?${params.toString()}`);
  };

  const destinations = [
    { name: 'Bangalore', subtitle: '3 Hotels Available', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Goa', subtitle: '3 Beach Resorts Available', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hyderabad', subtitle: '3 Heritage Stays Available', img: 'https://images.unsplash.com/photo-1572455857811-045fb4255b5d?auto=format&fit=crop&w=600&q=80' },
    { name: 'Ooty', subtitle: '3 Hill Resorts Available', img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80' },
    { name: 'Chennai', subtitle: '3 Coastal Hotels Available', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80' },
    { name: 'Mumbai', subtitle: '3 Luxury Stays Available', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Jaipur', subtitle: '3 Royal Haveli Stays Available', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80' },
    { name: 'Manali', subtitle: '3 Alpine Lodges Available', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">Premier Destinations & Stays</span>
          <h1 className="hero-title">Find Your Perfect Stay</h1>
          <p className="hero-subtitle">
            Explore 24+ handpicked luxury hotels, coastal retreats, and mountain resorts across 8 top Indian destinations.
          </p>

          {/* Search Card */}
          <form className="search-bar-card" onSubmit={handleSearch}>
            <div className="search-field">
              <label>Destination / City</label>
              <input
                type="text"
                placeholder="Where to? (e.g. Goa, Mumbai, Manali, Jaipur)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="search-field">
              <label>Check-in</label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>

            <div className="search-field">
              <label>Check-out</label>
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>

            <div className="search-field">
              <label>Guests</label>
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
              </select>
            </div>

            <button type="submit" className="btn-search">
              🔍 Search Stays
            </button>
          </form>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Pick a destination to view all 3 premier hotels in each city</p>
          </div>
          <Link to="/hotels" className="link-see-all">View all stays &rarr;</Link>
        </div>

        <div className="destinations-grid">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              className="destination-card"
              onClick={() => navigate(`/hotels?location=${dest.name}`)}
            >
              <img src={dest.img} alt={dest.name} loading="lazy" />
              <div className="dest-overlay">
                <h3>{dest.name}</h3>
                <p>{dest.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Luxury Hotels</h2>
              <p className="section-subtitle">Handpicked luxury properties with top customer ratings</p>
            </div>
            <Link to="/hotels" className="link-see-all">Explore all 24 hotels &rarr;</Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading featured stays...</p>
            </div>
          ) : (
            <div className="hotels-grid">
              {featuredHotels.map((hotel) => (
                <div key={hotel.id} className="hotel-card">
                  <div className="hotel-image-wrapper">
                    <img src={hotel.imageUrl} alt={hotel.name} loading="lazy" />
                    <span className="hotel-badge-rating">★ {hotel.rating}</span>
                    <span className="hotel-badge-location">📍 {hotel.location}</span>
                  </div>
                  <div className="hotel-card-content">
                    <div className="hotel-location">📍 {hotel.location}</div>
                    <h3 className="hotel-card-title">{hotel.name}</h3>
                    <p className="hotel-card-desc">{hotel.description}</p>
                    <div className="hotel-card-footer">
                      <div className="hotel-price">
                        <span className="price-label">Starts from</span>
                        <span className="price-amount">₹{hotel.startingPrice?.toLocaleString('en-IN')}</span>
                        <span className="price-unit">/ night</span>
                      </div>
                      <Link to={`/hotels/${hotel.id}`} className="btn btn-primary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose StayHaven */}
      <section className="section container">
        <div className="section-header center">
          <h2 className="section-title">Why Book With StayHaven?</h2>
          <p className="section-subtitle">Simplicity, transparency, and instant bookings guaranteed</p>
        </div>

        <div className="features-grid">
          <div className="feature-box">
            <span className="feature-icon">🛡️</span>
            <h3>No Hidden Charges</h3>
            <p>Direct room prices calculated instantly with transparent nightly rates.</p>
          </div>
          <div className="feature-box">
            <span className="feature-icon">⚡</span>
            <h3>Instant Confirmation</h3>
            <p>One-click confirmation without needing complex payment gateways.</p>
          </div>
          <div className="feature-box">
            <span className="feature-icon">📅</span>
            <h3>Real-time Availability</h3>
            <p>Guaranteed conflict-free room scheduling with smart overlapping check.</p>
          </div>
          <div className="feature-box">
            <span className="feature-icon">🏨</span>
            <h3>Verified Stays</h3>
            <p>Multiple curated boutique and 5-star properties per destination.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
