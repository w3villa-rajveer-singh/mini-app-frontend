import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Login.css";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    // ✅ Auto redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, []);

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
            // ✅ login() already stores token (from auth.js)
            await login(formData);

            // ✅ Redirect after login
            navigate("/dashboard");

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

                <p style={{ textAlign: "center", marginTop: "10px" }}>
                    New user? <Link to="/signup">Sign up</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;