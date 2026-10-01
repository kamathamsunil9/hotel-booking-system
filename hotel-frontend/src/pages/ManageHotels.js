import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelService, adminService } from '../services/api';

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const initialForm = {
    name: '',
    location: '',
    description: '',
    rating: 4.5,
    imageUrl: '',
    amenities: 'WiFi, Parking, Swimming Pool, Restaurant, Room Service, Air Conditioning',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await hotelService.getAllHotels();
      setHotels(res.data);
    } catch (err) {
      setError('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setCurrentId(null);
    setShowModal(true);
    setError('');
  };

  const openEditModal = (hotel) => {
    setFormData({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      rating: hotel.rating,
      imageUrl: hotel.imageUrl,
      amenities: hotel.amenities,
    });
    setIsEditing(true);
    setCurrentId(hotel.id);
    setShowModal(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isEditing) {
        await adminService.updateHotel(currentId, formData);
        setSuccess('Hotel updated successfully!');
      } else {
        await adminService.createHotel(formData);
        setSuccess('Hotel added successfully!');
      }
      setShowModal(false);
      fetchHotels();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save hotel');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? All associated rooms will also be deleted.`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await adminService.deleteHotel(id);
      setSuccess(`Hotel "${name}" deleted successfully.`);
      fetchHotels();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete hotel');
    }
  };

  return (
    <div className="admin-page container">
      <div className="breadcrumb">
        <Link to="/admin">Admin Dashboard</Link> &gt; <span>Manage Hotels</span>
      </div>

      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Manage Hotels</h1>
          <p className="page-subtitle">Add, update, or remove hotel properties in the system</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add New Hotel
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading hotels...</p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Hotel Name</th>
                  <th>Location</th>
                  <th>Rating</th>
                  <th>Amenities</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((h) => (
                  <tr key={h.id}>
                    <td>#{h.id}</td>
                    <td>
                      <img src={h.imageUrl} alt={h.name} className="table-thumbnail" />
                    </td>
                    <td>
                      <strong>{h.name}</strong>
                    </td>
                    <td>📍 {h.location}</td>
                    <td>★ {h.rating}</td>
                    <td>
                      <small className="text-muted line-clamp-1">{h.amenities}</small>
                    </td>
                    <td>
                      <div className="table-action-btns">
                        <button
                          className="btn btn-outline btn-xs"
                          onClick={() => openEditModal(h)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-xs"
                          onClick={() => handleDelete(h.id, h.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Hotel' : 'Add New Hotel'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Hotel Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Location (City)</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Rating (1.0 to 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Amenities (Comma separated)</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save Changes' : 'Create Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHotels;
