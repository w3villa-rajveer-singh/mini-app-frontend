import React, { useState, useEffect } from "react";
import { login } from "../api/auth";
import { getProfile } from "../api/user";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.css";

// ✅ Use env variable
const BACKEND_URL = process.env.REACT_APP_API_URL;

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Social Login Handlers
  const googleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google_oauth2`;
  };

  const facebookLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/facebook`;
  };

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // ✅ Email confirmation message
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("confirmed")) {
      setSuccessMessage("✅ Email verified successfully! Please login.");
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginResponse = await login(formData);
      console.log("Login successful:", loginResponse);
      
      // Check if user is admin and redirect accordingly
      try {
        const profile = await getProfile();
        console.log("Profile data:", profile);
        console.log("User data:", profile.user);
        console.log("Is admin:", profile.user.admin);
        
        if (profile.user.admin) {
          console.log("Redirecting to admin dashboard");
          navigate("/admin/users");
        } else {
          console.log("Redirecting to regular dashboard");
          navigate("/dashboard");
        }
      } catch (profileError) {
        console.error("Profile fetch error:", profileError);
        // If profile fetch fails, default to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        {successMessage && <p className="success">{successMessage}</p>}
        {error && <p className="error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 🔥 Social Login Section */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p>OR</p>

          <button type="button" onClick={googleLogin} style={{ margin: "5px" }}>
            Continue with Google
          </button>

          <button type="button" onClick={facebookLogin} style={{ margin: "5px" }}>
            Continue with Facebook
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          New user? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;