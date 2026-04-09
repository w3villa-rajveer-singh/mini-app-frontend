import React, { useState, useEffect } from "react";
import { login } from "../api/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.css";

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
      navigate("/");
    }
  }, [navigate]);

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

  // ✅ FINAL LOGIN FIX
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(formData);

      const token = response.data.token;
      const user = response.data.user;

      console.log("Login success:", response.data);

      // ✅ SAVE EVERYTHING
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ React navigation (NO reload)
      navigate("/");

    } catch (err) {
      console.error(err);
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

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p>OR</p>

          <button type="button" onClick={googleLogin}>
            Continue with Google
          </button>

          <button type="button" onClick={facebookLogin}>
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