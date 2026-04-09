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
          setLoading(false);
          return;
        }

        const profile = await getProfile();

        // 🔍 DEBUG: Log the entire profile response
        console.log("Profile response:", profile);
        console.log("User admin status:", profile?.user?.admin);

        // ✅ FIX HERE
        setIsAdmin(profile.user.admin);

      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isAdmin) {
    return <Navigate to="/admin/users" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default AdminRedirect;