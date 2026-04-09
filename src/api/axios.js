import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Attach token to every request
API.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    if (token) {
      // Remove duplicate "Bearer " if present
      if (token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "");
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle errors (SAFE VERSION)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔍 Debug log (VERY IMPORTANT)
    if (error.response) {
      console.warn("API Error:", {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });
    }

    // ✅ Only logout if AUTH endpoint fails
    if (
      error.response?.status === 401 &&
      error.config?.url?.includes("/profile")
    ) {
      console.warn("Auth failed → logging out");

      localStorage.removeItem("token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;