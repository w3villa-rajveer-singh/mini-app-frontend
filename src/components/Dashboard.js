import React, { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { logout } from "../api/auth";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(null);

  // ✅ location state
  const [location, setLocation] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });

  // ✅ Google Maps script loading
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [autocomplete, setAutocomplete] = useState(null);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const newLocation = {
        address: place.formatted_address,
        latitude: lat,
        longitude: lng,
      };

      setLocation(newLocation);
      saveLocationToBackend(newLocation);
    }
  };

  // Save location to backend
  const saveLocationToBackend = async (locationData) => {
    try {
      const formData = new FormData();
      formData.append("user[address]", locationData.address);
      formData.append("user[latitude]", locationData.latitude);
      formData.append("user[longitude]", locationData.longitude);

      await API.put("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.error("Failed to save location:", err);
    }
  };

  // Handle address click to open Google Maps
  const handleAddressClick = () => {
    if (location.latitude && location.longitude) {
      const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  // Handle profile download
  const handleDownloadProfile = () => {
    const profileData = {
      email: user?.email,
      userId: user?.id,
      currentPlan: user?.plan_type ? user.plan_type.charAt(0).toUpperCase() + user.plan_type.slice(1) : 'Free',
      planExpiry: user?.plan_expiry ? new Date(user.plan_expiry).toLocaleDateString() : 'Never',
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      downloadedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profile_${user?.email}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const navigate = useNavigate();

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.user);
        setAvatarUrl(res.avatar_url);

        // Set location from backend if available
        if (res.location && res.location.address) {
          setLocation({
            address: res.location.address,
            latitude: res.location.latitude,
            longitude: res.location.longitude,
          });
        }
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

  // Upload avatar
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

  // Logout
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

  // Stripe Subscribe
  const subscribe = async (priceId, plan) => {
    try {
      console.log("Sending:", priceId, plan);
      console.log("Environment variables:", {
        silver: process.env.REACT_APP_SILVER_PRICE_ID,
        gold: process.env.REACT_APP_GOLD_PRICE_ID
      });

      const res = await API.post("/create-checkout", {
        payment: {
          price_id: priceId,
        },
        plan: plan, // ✅ ADD THIS
      });

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        {/* Welcome Section - Only show when profile and plans tabs are NOT active */}
        {activeTab !== 'profile' && activeTab !== 'plans' && (
          <>
            <h1>Welcome, {user?.email}</h1>

            {/* Avatar */}
            <div className="avatar-section">
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
            </div>
          </>
        )}

        {/* Tabs Container */}
        <div className="tabs-container">
          {activeTab === 'profile' && (
            <button
              className={'tab-button'}
              onClick={() => setActiveTab(null)}
            >
              Back to Dashboard
            </button>
          )}
          {activeTab === 'plans' && (
            <button
              className={'tab-button'}
              onClick={() => setActiveTab(null)}
            >
              Back to Dashboard
            </button>
          )}
          <button
            className={activeTab === 'profile' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={activeTab === 'plans' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('plans')}
          >
            Plans
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            {/* User Info Section */}
            <div className="user-info-section">
              <h3>User Information</h3>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Current Plan:</strong> {user?.plan_type ? user.plan_type.charAt(0).toUpperCase() + user.plan_type.slice(1) : 'Free'}</p>
              <p><strong>Expiry:</strong> {user?.plan_expiry ? new Date(user.plan_expiry).toLocaleDateString() : 'Never'}</p>
              {location.address && (
                <>
                  <p>
                    <strong>Address:</strong> {location.address}
                    <span
                      style={{
                        cursor: "pointer",
                        color: "#6c63ff",
                        marginLeft: "2px",
                        fontSize: "16px"
                      }}
                      onClick={handleAddressClick}
                      title="View on Google Maps"
                    >
                      📍
                    </span>
                  </p>
                  <p><strong>Latitude:</strong> {location.latitude}</p>
                  <p><strong>Longitude:</strong> {location.longitude}</p>
                </>
              )}
            </div>

            {/* LOCATION INPUT SECTION */}
            {/* ✅ LOCATION INPUT SECTION */}
            <div className="location-input-section">
              <h3>Select Your Location</h3>
              {isLoaded ? (
                <Autocomplete
                  onLoad={(auto) => setAutocomplete(auto)}
                  onPlaceChanged={onPlaceChanged}
                >
                  <input
                    type="text"
                    placeholder="Search your location"
                    className="location-input"
                    defaultValue={location.address}
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  placeholder="Loading location search..."
                  className="location-input"
                  disabled
                />
              )}

              <button className="download-profile-btn" onClick={handleDownloadProfile}>
                Download Profile
              </button>
            </div>
          </div>
        )}

        {/* Plans Tab Content */}
        {activeTab === 'plans' && (
          <div className="tab-content">
            <div className="plans-section">
              <h3>Upgrade Plan</h3>

              <div className="plan-buttons">
                <button className="silver-btn" onClick={() => subscribe(process.env.REACT_APP_SILVER_PRICE_ID, "silver")}>
                  Buy Silver
                </button>

                <button className="gold-btn" onClick={() => subscribe(process.env.REACT_APP_GOLD_PRICE_ID, "gold")}>
                  Buy Gold
                </button>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;