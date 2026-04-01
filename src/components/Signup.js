import React, { useState } from "react";
import { signup } from "../api/auth";
import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await signup(formData);
            alert("Signup successful");
        } catch (err) {
            setError(err.response?.data?.errors?.join(", ") || "Signup failed");
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-card" onSubmit={handleSignup}>
                <h2>Sign Up</h2>

                {error && <p className="error">{error}</p>}

                <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm password"
                    onChange={handleChange}
                    required
                />

                <button type="submit">Sign Up</button>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;