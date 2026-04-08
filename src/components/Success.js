import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>✅ Payment Successful</h1>
      <p>Your subscription is now active.</p>

      <p><strong>Session ID:</strong> {sessionId}</p>

      <p>Redirecting to dashboard...</p>
    </div>
  );
}

export default Success;