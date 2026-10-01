import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelService, roomService, adminService } from '../services/api';

const ManageRooms = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const initialForm = {
    hotelId: '',
    roomNumber: '',
    roomType: 'DOUBLE',
    pricePerNight: 3000,
    capacity: 2,
    description: 'Spacious and comfortable bedroom equipped with modern amenities.',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotelId) {
      fetchRooms(selectedHotelId);
    }
  }, [selectedHotelId]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await hotelService.getAllHotels();
      setHotels(res.data);
      if (res.data.length > 0) {
        setSelectedHotelId(res.data[0].id);
      }
    } catch (err) {
      setError('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async (hotelId) => {
    try {
      const res = await roomService.getRoomsByHotelId(hotelId);
      setRooms(res.data);
    } catch (err) {
      setError('Failed to load rooms for selected hotel');
    }
  };

  const openAddModal = () => {
    setFormData({ ...initialForm, hotelId: selectedHotelId });
    setIsEditing(false);
    setCurrentId(null);
    setShowModal(true);
    setError('');
  };

  const openEditModal = (room) => {
    setFormData({
      hotelId: selectedHotelId,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      description: room.description || '',
    });
    setIsEditing(true);
    setCurrentId(room.id);
    setShowModal(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        hotelId: Number(formData.hotelId),
        pricePerNight: Number(formData.pricePerNight),
        capacity: Number(formData.capacity),
      };

      if (isEditing) {
        await adminService.updateRoom(currentId, payload);
        setSuccess('Room updated successfully!');
      } else {
        await adminService.createRoom(payload);
        setSuccess('Room created successfully!');
      }
      setShowModal(false);
      fetchRooms(selectedHotelId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save room');
    }
  };

  const handleDelete = async (id, roomNumber) => {
    if (!window.confirm(`Are you sure you want to delete Room #${roomNumber}?`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await adminService.deleteRoom(id);
      setSuccess(`Room #${roomNumber} deleted successfully.`);
      fetchRooms(selectedHotelId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete room');
    }
  };

  return (
    <div className="admin-page container">
      <div className="breadcrumb">
        <Link to="/admin">Admin Dashboard</Link> &gt; <span>Manage Rooms</span>
      </div>

      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Manage Rooms</h1>
          <p className="page-subtitle">Configure inventory, pricing, room types, and capacity</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} disabled={hotels.length === 0}>
          + Add New Room
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter by Hotel */}
      <div className="filter-card">
        <div className="filter-group">
          <label>Select Hotel Property</label>
          <select
            value={selectedHotelId}
            onChange={(e) => setSelectedHotelId(Number(e.target.value))}
          >
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading rooms...</p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Room #</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Price / Night</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No rooms registered for this hotel. Click "+ Add New Room" above.</td>
                  </tr>
                ) : (
                  rooms.map((r) => (
                    <tr key={r.id}>
                      <td><strong>Room {r.roomNumber}</strong></td>
                      <td>
                        <span className="room-type-badge">{r.roomType}</span>
                      </td>
                      <td>👥 {r.capacity} {r.capacity === 1 ? 'Guest' : 'Guests'}</td>
                      <td><strong>₹{r.pricePerNight?.toLocaleString('en-IN')}</strong></td>
                      <td>
                        <small className="text-muted line-clamp-1">{r.description}</small>
                      </td>
                      <td>
                        <div className="table-action-btns">
                          <button
                            className="btn btn-outline btn-xs"
                            onClick={() => openEditModal(r)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-xs"
                            onClick={() => handleDelete(r.id, r.roomNumber)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
              <h3>{isEditing ? 'Edit Room' : 'Add New Room'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Target Hotel</label>
                <select
                  value={formData.hotelId}
                  onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
                  required
                >
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Room Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 101, 202"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Room Type</label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  >
                    <option value="SINGLE">SINGLE</option>
                    <option value="DOUBLE">DOUBLE</option>
                    <option value="DELUXE">DELUXE</option>
                    <option value="SUITE">SUITE</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Price Per Night (₹)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Max Capacity (Guests)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
