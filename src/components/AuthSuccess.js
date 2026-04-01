import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";

function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  }, []);

  return (
    <div className="auth-message success">
      <h2>✅ Email Verified!</h2>
      <p>Logging you in...</p>
    </div>
  );
}

export default AuthSuccess;