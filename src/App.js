import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthSuccess from "./components/AuthSuccess";
import AuthError from "./components/AuthError";
import SocialLogin from "./components/SocialLogin"; // ✅ ADD THIS
import Success from "./components/Success";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 🔥 Sync token when it changes (login/logout)
  useEffect(() => {
    const syncToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", syncToken);

    return () => {
      window.removeEventListener("storage", syncToken);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* Default route */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* ✅ Social login callback route */}
        <Route path="/social-login" element={<SocialLogin />} />

        {/* Auth routes */}
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/auth-error" element={<AuthError />} />

        {/* ✅ ADD THIS 👇 */}
        <Route path="/success" element={<Success />} />

        {/* Login */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={!token ? <Signup /> : <Navigate to="/dashboard" />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;