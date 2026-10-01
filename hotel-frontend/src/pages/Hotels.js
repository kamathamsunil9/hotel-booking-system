import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { hotelService } from '../services/api';

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLocation = searchParams.get('location') || '';

  const [hotels, setHotels] = useState([]);
  const [locations, setLocations] = useState([
    'All Locations',
    'Bangalore',
    'Chennai',
    'Goa',
    'Hyderabad',
    'Jaipur',
    'Manali',
    'Mumbai',
    'Ooty',
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    const locParam = searchParams.get('location') || '';
    setSelectedLocation(locParam);
    fetchHotels(locParam);
  }, [searchParams]);

  const fetchLocations = async () => {
    try {
      const res = await hotelService.getLocations();
      if (res.data && res.data.length > 0) {
        setLocations(['All Locations', ...res.data]);
      }
    } catch (err) {
      console.warn('Could not fetch dynamic locations, using defaults.');
    }
  };

  const fetchHotels = async (locToFilter) => {
    setLoading(true);
    setError('');
    try {
      const targetLoc = locToFilter || selectedLocation;
      const loc = (!targetLoc || targetLoc === 'All Locations') ? '' : targetLoc;
      const res = await hotelService.getAllHotels(loc);
      setHotels(res.data);
    } catch (err) {
      setError('Failed to load hotels. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (loc) => {
    setSelectedLocation(loc);
    if (loc === 'All Locations' || !loc) {
      searchParams.delete('location');
    } else {
      searchParams.set('location', loc);
    }
    setSearchParams(searchParams);
  };

  // Filter & sort hotels locally
  const filteredHotels = hotels
    .filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = (hotel.rating || 0) >= minRating;
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        return (a.startingPrice || 0) - (b.startingPrice || 0);
      }
      if (sortBy === 'price-high') {
        return (b.startingPrice || 0) - (a.startingPrice || 0);
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0; // recommended
    });

  // Preserve search params for checkIn/checkOut when clicking hotel details
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');
  const queryStr = [
    checkIn ? `checkIn=${checkIn}` : '',
    checkOut ? `checkOut=${checkOut}` : '',
    guests ? `guests=${guests}` : '',
  ].filter(Boolean).join('&');

  return (
    <div className="hotels-page container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          {selectedLocation && selectedLocation !== 'All Locations'
            ? `Hotels & Resorts in ${selectedLocation}`
            : 'Explore All Hotels & Resorts'}
        </h1>
        <p className="page-subtitle">
          {selectedLocation && selectedLocation !== 'All Locations'
            ? `Showing all available properties in ${selectedLocation}. Pick your favorite stay!`
            : 'Choose from luxury suites, beachfront villas, and mountain chalets across top Indian destinations.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-card">
        <div className="filter-row">
          <div className="filter-group flex-2">
            <label>Search Hotel / City</label>
            <input
              type="text"
              placeholder="Search by hotel name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Destination Location</label>
            <select
              value={selectedLocation || 'All Locations'}
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Min Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <option value={0}>Any Rating</option>
              <option value={4.0}>4.0+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={4.8}>4.8+ Stars</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Quick Location Badges */}
      <div className="results-meta">
        <p>
          Showing <strong>{filteredHotels.length}</strong> {filteredHotels.length === 1 ? 'hotel' : 'hotels'}
          {selectedLocation && selectedLocation !== 'All Locations' && ` in ${selectedLocation}`}
        </p>
      </div>

      {/* Error alert */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Content */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading available hotels...</p>
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏨</span>
          <h3>No hotels found matching your search</h3>
          <p>Try clearing your filters or selecting a different location.</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSearchTerm('');
              handleLocationChange('All Locations');
              setMinRating(0);
              setSortBy('recommended');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="hotels-grid">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-image-wrapper">
                <img src={hotel.imageUrl} alt={hotel.name} loading="lazy" />
                <span className="hotel-badge-rating">★ {hotel.rating}</span>
                <span className="hotel-badge-location">📍 {hotel.location}</span>
              </div>

              <div className="hotel-card-content">
                <h3 className="hotel-card-title">{hotel.name}</h3>
                <p className="hotel-card-desc">{hotel.description}</p>

                {hotel.amenities && (
                  <div className="amenities-preview">
                    {hotel.amenities.split(',').slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="amenity-chip">
                        ✓ {amenity.trim()}
                      </span>
                    ))}
                    {hotel.amenities.split(',').length > 3 && (
                      <span className="amenity-chip more">
                        +{hotel.amenities.split(',').length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="hotel-card-footer">
                  <div className="hotel-price">
                    <span className="price-label">Starting at</span>
                    <span className="price-amount">₹{hotel.startingPrice?.toLocaleString('en-IN')}</span>
                    <span className="price-unit">/ night</span>
                  </div>

                  <Link
                    to={`/hotels/${hotel.id}${queryStr ? `?${queryStr}` : ''}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hotels;
