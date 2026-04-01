import { useLocation } from "react-router-dom";
import "./Auth.css";

function AuthError() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const message = params.get("message");

  return (
    <div className="auth-message error">
      <h2>❌ Verification Failed</h2>
      <p>
        {message === "invalid_or_expired"
          ? "This link is invalid or expired."
          : "Something went wrong."}
      </p>
    </div>
  );
}

export default AuthError;