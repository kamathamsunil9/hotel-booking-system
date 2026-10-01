import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="brand-icon">🏨</span>
            <span className="brand-text">Stay<span className="brand-accent">Haven</span></span>
          </div>
          <p className="footer-desc">
            Find and book luxury hotels, serene resorts, and boutique stays across Bangalore, Goa, Hyderabad, Ooty, Chennai, Mumbai, Jaipur, and Manali.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/hotels">Browse Hotels</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Popular Destinations</h4>
          <ul>
            <li><Link to="/hotels?location=Goa">Goa Beach Resorts</Link></li>
            <li><Link to="/hotels?location=Mumbai">Mumbai Luxury Stays</Link></li>
            <li><Link to="/hotels?location=Jaipur">Jaipur Royal Haveli</Link></li>
            <li><Link to="/hotels?location=Manali">Manali Alpine Lodges</Link></li>
            <li><Link to="/hotels?location=Bangalore">Bangalore Hotels</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support & Security</h4>
          <p className="footer-info">🔒 Secure JWT Authentication</p>
          <p className="footer-info">⚡ Instant Confirmation</p>
          <p className="footer-info">❌ Free & Easy Cancellation</p>
          <p className="footer-info">🏨 3+ Hotels Per Destination</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} StayHaven Hotel Booking System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
