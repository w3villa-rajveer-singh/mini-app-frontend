import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getProfile } from "../api/user";

const AdminRedirect = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsAdmin(false);
          return;
        }

        const response = await getProfile();
        const user = response.user; // since you already fixed API

        setIsAdmin(user?.admin === true);

      } catch (error) {
        console.error("Error checking admin:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return isAdmin ? (
    <Navigate to="/admin/users" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default AdminRedirect;