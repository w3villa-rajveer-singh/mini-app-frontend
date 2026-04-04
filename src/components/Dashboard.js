import React, { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.user);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");

        localStorage.removeItem("token");
        window.location.href = "/login"; // 🔥 fix here too
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    logout();

    // 🔥 IMPORTANT FIX
    window.location.href = "/login";
  };

  if (loading) return <h2>Loading...</h2>;

  if (error) return <h2>{error}</h2>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Welcome, {user?.email}</h1>

        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User ID:</strong> {user?.id}</p>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;