import React, { useState, useEffect } from "react";
import { getAllUsers } from "../api/admin";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./AdminUsers.css";

const AdminUsers = () => {
  const getProviderClassName = (provider) => {
    switch (provider?.toLowerCase()) {
      case "email":
        return "provider-email";
      case "google_oauth2":
        return "provider-google";
      case "facebook":
        return "provider-facebook";
      default:
        return "provider-default";
    }
  };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, redirect to login
      navigate("/login");
    }
  };

  const fetchUsers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const data = await getAllUsers(page, search);
      const sortedUsers = data.users.sort((a, b) => a.id - b.id);
      setUsers(sortedUsers);
      setCurrentPage(data.current_page);
      setTotalPages(data.total_pages);
      setTotalCount(data.total_count);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, searchTerm);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-container">
          <div className="error-text">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1 className="admin-title">Admin - User Management</h1>
            <p className="admin-subtitle">Manage and monitor all user accounts</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      
      {/* Search Section */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by email..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search Users
          </button>
        </form>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <p className="stats-text">
          Total Users: <strong>{totalCount}</strong> | 
          Current Page: <strong>{currentPage} of {totalPages}</strong>
        </p>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Plan</th>
              <th>Plan Expiry</th>
              <th>Admin</th>
              <th>Provider</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="user-id">#{user.id}</td>
                <td className="user-email">{user.email}</td>
                <td className="user-name">{user.name || "Not set"}</td>
                <td>
                  <span className={`badge ${
                    user.plan_type === 'gold' ? 'badge-gold' :
                    user.plan_type === 'silver' ? 'badge-silver' :
                    'badge-free'
                  }`}>
                    {user.plan_type || 'free'}
                  </span>
                </td>
                <td>
                  <span className="badge badge-provider">
                    {user.plan_expiry ? formatDate(user.plan_expiry) : 'No expiry'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    user.admin ? 'badge-admin' : 'badge-no-admin'
                  }`}>
                    {user.admin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getProviderClassName(user.provider)}`}>
                    {user.provider ? user.provider.replace('_', ' ').toUpperCase() : 'EMAIL'}
                  </span>
                </td>
                <td>{formatDate(user.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing page {currentPage} of {totalPages} ({totalCount} total users)
            </div>
            <div className="pagination-controls">
              <div className="pagination-nav">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  ← Previous
                </button>
                
                {/* Page numbers */}
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = index + 1;
                  } else if (currentPage <= 3) {
                    pageNum = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + index;
                  } else {
                    pageNum = currentPage - 2 + index;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`pagination-button ${
                        currentPage === pageNum ? 'active' : ''
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {users.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-text">No users found</div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
