import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getAuthHeaders } from "../api";
import { useAuth } from "../context/AuthContext.jsx";
import { getPasswordStrength } from "../utils/passwordStrength";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT"
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const strength = getPasswordStrength(newUser.password);

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users", { headers: getAuthHeaders() });
      setUsers(res.data.users || []);
    } catch (err) {
      setError("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/admin/users", newUser, { headers: getAuthHeaders() });
      setNewUser({ name: "", email: "", password: "", role: "STUDENT" });
      loadUsers();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create user";
      setError(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`, { headers: getAuthHeaders() });
      loadUsers();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete user";
      setError(msg);
    }
  };

  const totalAdmins = users.filter((u) => u.role === "ADMIN").length;
  const totalStudents = users.filter((u) => u.role === "STUDENT").length;

  return (
    <div className="admin-container">
      <div className="admin-header-bar">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">
            Manage users, roles and access in the system.
          </p>
        </div>
        <div className="admin-header-actions">
          <span className="admin-current-user">
            👤 {user?.name} ({user?.role})
          </span>
          <button
            className="btn secondary"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>
          <button className="btn danger" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-main">
        {error && <p className="error-text">{error}</p>}

        <div className="admin-stats">
          <div className="stat-card">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{users.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Admins</p>
            <p className="stat-value">{totalAdmins}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Students</p>
            <p className="stat-value">{totalStudents}</p>
          </div>
        </div>

        <div className="admin-grid">
          <section className="admin-section">
            <h2>Create New User</h2>
            <form onSubmit={handleCreateUser} className="admin-form">
              <input
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, name: e.target.value }))
                }
              />
              <input
                placeholder="Email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, email: e.target.value }))
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, password: e.target.value }))
                }
              />
              {newUser.password && (
                <p className="hint-text">
                  Strength: <strong>{strength.label}</strong>
                </p>
              )}
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, role: e.target.value }))
                }
              >
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button className="btn" type="submit">
                Create User
              </button>
            </form>
          </section>

          <section className="admin-section">
            <h2>All Users</h2>
            <div className="table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id || u._id}>
                      <td>{u.email}</td>
                      <td>{u.name}</td>
                      <td>
                        <span className="role-chip">{u.role}</span>
                      </td>
                      <td>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        <button
                          className="btn danger small"
                          onClick={() => handleDelete(u.id || u._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}