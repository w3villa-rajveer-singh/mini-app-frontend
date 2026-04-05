import API from "./axios";

// SIGNUP
export const signup = async (data) => {
  const response = await API.post("/signup", {
    user: data,
  });

  return response.data;
};

// LOGIN
export const login = async (data) => {
  const response = await API.post("/login", {
    user: data,
  });

  console.log("LOGIN RESPONSE:", response);

  // 🔥 IMPORTANT: Devise JWT sends token in headers
  const token = response.headers.authorization;

  if (token) {
    localStorage.setItem("token", token);
    console.log("✅ TOKEN SAVED:", token);
  } else {
    console.error("❌ No token found in headers");
  }

  return response.data;
};

// LOGOUT
export const logout = async () => {
  try {
    // ✅ REQUIRED for blacklist
    await API.delete("/logout");
  } catch (err) {
    console.error("Logout API failed", err);
  } finally {
    localStorage.removeItem("token");
  }
};