import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AuthSuccess from "./components/AuthSuccess";
import AuthError from "./components/AuthError";
import SocialLogin from "./components/SocialLogin";
import Success from "./components/Success";
import AdminUsers from "./components/AdminUsers";
import AdminRedirect from "./components/AdminRedirect";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            isLoggedIn ? (
              <ProtectedRoute>
                <AdminRedirect />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/social-login" element={<SocialLogin />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/auth-error" element={<AuthError />} />
        <Route path="/success" element={<Success />} />

        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!isLoggedIn ? <Signup /> : <Navigate to="/" />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;