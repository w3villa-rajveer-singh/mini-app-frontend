import React, { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { logout } from "../api/auth";
import API from "../api/axios"; // ✅ USE THIS
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.user);
        setAvatarUrl(res.avatar_url);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ✅ Upload handler (PRODUCTION SAFE)
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const formData = new FormData();
    formData.append("user[avatar]", file);

    try {
      const res = await API.put("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPreview(null);
      setAvatarUrl(res.data.avatar_url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Welcome, {user?.email}</h1>

        {/* Avatar / Preview / Fallback */}
        {preview || avatarUrl ? (
          <img
            src={preview || avatarUrl}
            alt="avatar"
            className="avatar"
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <div className="avatar-placeholder">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Upload */}
        <label className="upload-btn">
          Upload Profile Picture
          <input type="file" onChange={handleUpload} hidden />
        </label>

        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User ID:</strong> {user?.id}</p>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;