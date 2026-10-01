import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8083';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected routes, can clear session if invalid token
      if (localStorage.getItem('token') && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Hotel APIs
export const hotelService = {
  getAllHotels: (location) => api.get('/api/hotels', { params: location ? { location } : {} }),
  getHotelById: (id) => api.get(`/api/hotels/${id}`),
  getLocations: () => api.get('/api/hotels/locations'),
};

// Room APIs
export const roomService = {
  getRoomsByHotelId: (hotelId) => api.get(`/api/hotels/${hotelId}/rooms`),
  getRoomById: (roomId) => api.get(`/api/rooms/${roomId}`),
  checkAvailability: (roomId, checkIn, checkOut) =>
    api.get(`/api/rooms/${roomId}/availability`, {
      params: { checkIn, checkOut },
    }),
};

// Booking APIs
export const bookingService = {
  createBooking: (bookingData) => api.post('/api/bookings', bookingData),
  getMyBookings: () => api.get('/api/bookings/my'),
  getBookingById: (id) => api.get(`/api/bookings/${id}`),
  cancelBooking: (id) => api.put(`/api/bookings/${id}/cancel`),
};

// Admin APIs
export const adminService = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  // Hotels
  createHotel: (hotelData) => api.post('/api/admin/hotels', hotelData),
  updateHotel: (id, hotelData) => api.put(`/api/admin/hotels/${id}`, hotelData),
  deleteHotel: (id) => api.delete(`/api/admin/hotels/${id}`),
  // Rooms
  createRoom: (roomData) => api.post('/api/admin/rooms', roomData),
  updateRoom: (id, roomData) => api.put(`/api/admin/rooms/${id}`, roomData),
  deleteRoom: (id) => api.delete(`/api/admin/rooms/${id}`),
  // Bookings
  getAllBookings: () => api.get('/api/admin/bookings'),
  updateBookingStatus: (id, status) => api.put(`/api/admin/bookings/${id}/status`, { status }),
  // Users
  getAllUsers: () => api.get('/api/admin/users'),
};

export default api;
