import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load registered users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page container">
      <div className="breadcrumb">
        <Link to="/admin">Admin Dashboard</Link> &gt; <span>Manage Users</span>
      </div>

      <div className="page-header">
        <h1 className="page-title">Registered Users</h1>
        <p className="page-subtitle">View all registered customers and administrators</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>#{u.id}</strong></td>
                    <td>
                      <div className="user-cell">
                        <span className="user-avatar-sm">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge status-confirmed">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
