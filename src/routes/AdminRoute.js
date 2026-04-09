import React from "react";
import { Navigate } from "react-router-dom";
import { getProfile } from "../api/user";

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
        console.log("AdminRoute - Profile response:", profile);
        console.log("AdminRoute - User admin status:", profile?.user?.admin);
        
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
        <div className="text-lg">Checking permissions...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
