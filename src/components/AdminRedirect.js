import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getProfile } from "../api/user";

const AdminRedirect = () => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getProfile();

        const user = response.user;

        console.log("AdminRedirect user:", user);

        // ✅ SAVE USER GLOBALLY
        localStorage.setItem("user", JSON.stringify(user));

        setIsAdmin(user.admin === true);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setIsAdmin(false);
      }
    };

    fetchUser();
  }, []);

  if (isAdmin === null) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return isAdmin ? (
    <Navigate to="/admin/users" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default AdminRedirect;