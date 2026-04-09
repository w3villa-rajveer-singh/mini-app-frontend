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
        const adminStatus = profile.user.admin;
        console.log("AdminRedirect - Setting isAdmin to:", adminStatus);
        setIsAdmin(adminStatus);

      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  console.log("AdminRedirect render - loading:", loading, "isAdmin:", isAdmin);
  
  if (loading) {
    console.log("AdminRedirect - Showing loading state");
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isAdmin) {
    console.log("AdminRedirect - Redirecting to admin dashboard");
    return <Navigate to="/admin/users" replace />;
  }

  console.log("AdminRedirect - Redirecting to regular dashboard");
  return <Navigate to="/dashboard" replace />;
};

export default AdminRedirect;